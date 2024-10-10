import Button from '../components/Button';
import React, { useState, useEffect } from 'react';
import './play.css';

const MAX_CHARGE = 3;

const Play = ({ socket }) => {
    const [userName, setUserName] = useState('testuser');
    const [roomName, setRoomName] = useState('testroom');
    const [message, setMessage] = useState('');
    const [charge, setCharge] = useState(0);
    const [actionPending, setActionPending] = useState(false);
    const [result, setResult] = useState(null);

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
            setResult(data);
            setActionPending(false);
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
        socket.emit('message', { roomName: roomName, msg: message, userName: userName });
        setMessage('');
    };

    const handleCharge = () => {
        if (charge < MAX_CHARGE && !actionPending) {
            setCharge(charge + 1);
            setActionPending(true);
            socket.emit('player_action', { room: roomName, username: userName, action: 'charge' });
        }
    };

    const handleAttack = () => {
        if (charge !== 0 && !actionPending) {
            setActionPending(true);
            socket.emit('player_action', { room: roomName, username: userName, action: 'attack' });
            setCharge(0);
        }
    };

    const handleDefence = () => {
        if (!actionPending) {
            setActionPending(true);
            socket.emit('player_action', { room: roomName, username: userName, action: 'defense' });
        }
    };

    return (
        <div className='main-container'>
            <div className="game-container">
                <div className="box chat-container left">
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
