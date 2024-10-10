import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Play from './Play';

function Room({ globalsocket, roomname }) {
    console.log("Room component received socket:", globalsocket);  // globalsocket の状態を確認

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (globalsocket && typeof globalsocket.on === 'function') {
            console.log("Setting up socket listeners in Room component");

            // メッセージを受信するためのイベントリスナーを設定
            globalsocket.on('message', (message) => {
                console.log("Message received in room: ", message);
                setMessages((prevMessages) => [...prevMessages, message.msg]);
            });

            // クリーンアップ処理（コンポーネントがアンマウントされたときにイベントリスナーを削除）
            return () => {
                console.log("Cleaning up socket listeners in Room component");
                globalsocket.off('message');
            };
        } else {
            console.error("Socket is undefined or not a function in Room component");
        }
    }, [globalsocket]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (globalsocket && message) {
            console.log(`Sending message to room: ${roomname}, message: ${message}`);
            // メッセージを送信
            globalsocket.emit('message', { room: roomname, msg: message });
            setMessage('');  // メッセージ入力欄をクリア
        } else {
            console.error("Socket is not defined, cannot send message");
        }
    };

    return (
        <div className='room-container'>
            <h1>Room: {roomname}</h1>
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
                <Play socket={globalsocket}/>
            </div>
        </div>
    );
}

export default Room;
