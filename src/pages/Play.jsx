// import React, { useState, useEffect } from 'react';
// import Button from '../components/Button'
// import io from 'socket.io-client';

// const socket = io('http://http://localhost:5000');

// const Play = () => {

//     const [message, setMessage] = useState('');

//     useEffect(() => {
//       socket.on('message', msg => {
//         console.log(msg);
//       });
//     }, []);
  
//     const sendMessage = () => {
//       socket.emit(message);
//       setMessage('');
//     };

// export default Play;

import Button from '../components/Button'
import React, { useState, useEffect} from 'react';
import io from 'socket.io-client';
import './play.css';

// https://thatgame.azurewebsites.net
const socket = io('http://localhost:443',
    {
    secure:true,
    transports:['websocket','polling'],
    timeout:20000,
}
);

const Play = () => {

    const [message, setMessage] = useState('');
    const [charge, setCharge] = useState(0);
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

        // クリーンアップ関数でイベントリスナーを解除
        return () => {
            socket.off('connect');
            socket.off('connect_error');
            socket.off('disconnect');
            socket.off('message');
        };
    }, []);

    const sendMessage = () => {
        socket.emit('message', { room: 'room_name', msg: message });
        setMessage('');
    };


    const handleCharge = () => {
        if (charge < maxCharge) {
            setCharge(charge + 1);
        }

        fetch('http://localhost:443/play', {
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
        .catch((error) => {
            console.error('Error:', error);
        });

    }

    const handleAtack = () => {
        if(charge !== 0){
            fetch('http://localhost:443/play', {
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
            .catch((error) => {
                console.error('Error:', error);
            });

            setCharge(0);  // 攻撃後、チャージをリセット
        }
    }

    const handleDefence = () => {
        if(true){

        }
    }

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
