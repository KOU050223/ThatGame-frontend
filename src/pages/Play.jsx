import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import io from 'socket.io-client';
import './play.css';

const socket = io('http://172.17.9.141:5003');

const Play = () => {
  const [charge, setCharge] = useState(0);
  const [inputDisabled, setInputDisabled] = useState(false);  // 入力を無効にする状態
  const [confirmation, setConfirmation] = useState('');  // アクション確認メッセージ
  const [result, setResult] = useState('');  // 勝敗結果メッセージ
  const [roomName, setRoomName] = useState('');  // ルーム名
  const [username, setUsername] = useState('');  // ユーザー名
  const [joined, setJoined] = useState(false);  // ルームに参加したかどうかの状態
  const maxCharge = 3;

  useEffect(() => {
    // サーバーからのアクション結果を受け取る
    const handleActionResult = (data) => {
      console.log("Result received:", data);

      // 勝敗結果を表示するメッセージを設定
      if (data.is_draw) {
        setResult('引き分けです');
      } else {
        setResult(`${data.winner} が勝ちました`);
      }

      // 両者の結果が出たら入力を再度有効化
      setInputDisabled(false);
    };

    // アクションの送信確認をサーバーから受け取る
    const handleActionConfirmation = (data) => {
      setConfirmation(`${data.username} が ${data.action} を選択しました`);
    };

    socket.on('action_result', handleActionResult);
    socket.on('action_confirmation', handleActionConfirmation);  // 確認メッセージの受け取り

    // クリーンアップ
    return () => {
      socket.off('action_result', handleActionResult);
      socket.off('action_confirmation', handleActionConfirmation);
      setInputDisabled(false);
    };
  }, []);

  const sendAction = (action) => {
    // アクション送信前にボタンを無効化
    setInputDisabled(true);
    socket.emit('player_action', { 
      room: roomName,  // 入力されたルーム名
      username: username,  // 入力されたユーザー名
      action: action 
    });
  };

  const handleCharge = () => {
    if (charge < maxCharge && !inputDisabled) {
      setCharge(charge + 1);
      sendAction('charge');
    }
  };

  const handleAttack = () => {
    if (charge !== 0 && !inputDisabled) {
      sendAction('attack');
      setCharge(0);
    }
  };

  const handleDefence = () => {
    if (!inputDisabled) {
      sendAction('defense');
    }
  };

  const handleJoinRoom = () => {
    if (roomName && username) {
      setJoined(true);
      socket.emit('join_room', { room: roomName, username: username });
    }
  };

  return (
    <div className='main-container'>
      {!joined ? (
        <div className="join-room-container">
          <input
            type="text"
            placeholder="ルーム名を入力"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <input
            type="text"
            placeholder="ユーザー名を入力"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button onClick={handleJoinRoom} label="ルームに参加" />
        </div>
      ) : (
        <div className="game-container">
          <div className="box charge-container right">
            <div className="charge-label">チャージ</div>
            <div className="charge-dots">
              {[...Array(charge)].map((_, index) => (
                <div key={index} className="charge-dot"></div>
              ))}
            </div>
          </div>

          <div className="actions">
            <Button 
              onClick={handleCharge}
              label="溜め"
              disabled={inputDisabled}  // 入力無効化
            />
            <Button 
              onClick={handleAttack}
              label="攻撃"
              disabled={inputDisabled}  // 入力無効化
            />
            <Button 
              onClick={handleDefence}
              label="防御"
              disabled={inputDisabled}  // 入力無効化
            />
          </div>

          {/* アクション確認メッセージの表示 */}
          {confirmation && (
            <div className="confirmation-message">
              {confirmation}
            </div>
          )}

          {/* 勝敗結果メッセージの表示 */}
          {result && (
            <div className="result-message">
              {result}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Play;
