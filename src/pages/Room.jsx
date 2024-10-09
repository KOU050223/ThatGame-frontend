import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import io from 'socket.io-client';
import Play from './Play';

function Room({ socket }) {
    const { roomName } = useParams();  // useParamsフックでURLパラメータを取得
    // const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const user = prompt("Enter your name:");
        setUsername(user);

        // Socket.IOサーバーへの接続を初期化
        const newSocket = {socket} // FlaskサーバーのURLを指定
        // setSocket(newSocket);

        // サーバーに「join」イベントを送信
        newSocket.emit('join', { room: roomName, username: user });

        // サーバーからの「status」イベントを処理
        newSocket.on('status', function (data) {
            setMessages(prevMessages => [...prevMessages, data.msg]);
        });

        // サーバーからの「message」イベントを処理
        newSocket.on('message', function (data) {
            setMessages(prevMessages => [...prevMessages, data.msg]);
        });

        // クリーンアップ関数（コンポーネントがアンマウントされるときに「leave」イベントを送信）
        return () => {
            newSocket.emit('leave', { room: roomName, username: user });
            newSocket.disconnect();
        };
    }, [roomName]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (socket && message) {
            // メッセージを送信
            socket.emit('message', { room: roomName, msg: message });
            setMessage('');  // メッセージ入力欄をクリア
        }
    };

    return (
        <div className='room-container'>
            <h1>Room: {roomName}</h1>
            <div className="message-box">
            <ul id="messages">
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
            <form id="sendMessage" onSubmit={handleSendMessage}>
                <input 
                    id="message" 
                    type="text" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Enter message"
                    required
                />
                <button type="submit">Send</button>
            </form>
            </div>
            <div className="play-box">
                <Play/>
            </div>
        </div>
    );
}

export default Room;
