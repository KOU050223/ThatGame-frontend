import Button from '../components/Button'
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './play.css';


const Play = ({ socket }) => {
    console.log(socket);
    const [user_name, setUser_name] = useState('testuser');
    const [room_name, setRoom_name] = useState('testroom');
    const [message, setMessage] = useState('');
    const [charge, setCharge] = useState(0);
    const [actionPending, setActionPending] = useState(false); // サーバーからの結果待ちフラグ
    const [result, setResult] = useState(null); // サーバーからの結果を保存
    const maxCharge = 3; // チャージの最大数

    useEffect(() => {
        socket.on('message', msg => {
            console.log(msg);
        });

        socket.on('connect', () => {
            console.log('WebSocket 接続成功');
        });

        socket.on('connect_error', (error) => {
            console.error('WebSocket 接続エラー:', error);
        });

        socket.on('disconnect', () => {
            console.log('WebSocket 接続が切断されました');
        });

        socket.on('action_result', (data) => {
            console.log('Action result:', data);
            setResult(data); // サーバーからの結果を保存
            setActionPending(false); // 結果を受け取ったので待機状態を解除
        });

        return () => {
            socket.off('connect');
            socket.off('connect_error');
            socket.off('disconnect');
            socket.off('message');
            socket.off('action_result');
        };
    }, []);

    const sendMessage = () => {
        socket.emit('message', { room: room_name, msg: message, username:user_name});
        setMessage('');
    };

    const handleCharge = () => {
        if (charge < maxCharge && !actionPending) {
            setCharge(charge + 1);
            setActionPending(true); // アクション実行中は待機状態に
            socket.emit('player_action', { room: room_name, username: user_name, action: 'charge' });
        }
    };

    const handleAttack = () => {
        if (charge !== 0 && !actionPending) {
            setActionPending(true); // アクション実行中は待機状態に
            socket.emit('player_action', { room: room_name, username: user_name, action: 'attack' });
            setCharge(0);  // 攻撃後、チャージをリセット
        }
    };

    const handleDefence = () => {
        if (!actionPending) {
            setActionPending(true); // アクション実行中は待機状態に
            socket.emit('player_action', { room: room_name, username: user_name, action: 'defense' });
        }
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
                <div className="box opponent-hand center">相手の手: {result ? result.player2.action : '待機中'}</div>
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
                <Button onClick={handleCharge} label="溜め" disabled={actionPending} />
                <Button onClick={handleAttack} label="攻撃" disabled={actionPending || charge === 0} />
                <Button onClick={handleDefence} label="防御" disabled={actionPending} />
            </div>
        </div>
    );

};

export default Play;
