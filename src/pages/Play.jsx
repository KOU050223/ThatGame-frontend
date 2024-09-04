import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import io from 'socket.io-client';
import './play.css';

const socket = io('http://172.17.9.141:5003');

const Play = () => {
  const [message, setMessage] = useState('');
  const [charge, setCharge] = useState(0);
  const maxCharge = 3; // チャージの最大数

  useEffect(() => {
    const handleSocketMessage = (msg) => {
      console.log(msg);
    };

    socket.on('message', handleSocketMessage);

    // コンポーネントがアンマウントされるときにリスナーをクリーンアップ
    return () => {
      socket.off('message', handleSocketMessage);
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', message);
      setMessage('');
    }
  };

  const handleCharge = () => {
    if (charge < maxCharge) {
      setCharge(charge + 1);
    }
  };

  const handleAtack = () => {
    if (charge !== 0) {
      fetch('http://172.17.9.141:5003/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ charge: charge }),  // 現在のチャージをサーバーに送信
      })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
        })
        .catch(error => {
          console.error('Error:', error);
        });

      setCharge(0);  // 攻撃後、チャージをリセット
    }
  };

  const handleDefence = () => {
    // 防御のロジックをここに追加
    console.log("防御アクションがトリガーされました");
  };

  return (
    <div className='main-container'>
      <div className="game-container">
        <div className="box chat-container left">
          <div className="chat-label">チャット欄</div>
          <div className="chat-menu">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
        <div className="box opponent-hand center">相手の手</div>
        <div className="box charge-container right">
          <div className="charge-label">チャージ</div>
          <div className="charge-dots">
            {[...Array(charge)].map((_, index) => (
              <div key={index} className="charge-dot"></div>
            ))}
          </div>
        </div>
      </div>
      <div className="actions">
        <Button 
          onClick={handleCharge}
          label="溜め"
        />
        <Button 
          onClick={handleAtack}
          label="攻撃"
        />
        <Button 
          onClick={handleDefence}
          label="防御"
        />
      </div>
    </div>
  );
};

export default Play;
