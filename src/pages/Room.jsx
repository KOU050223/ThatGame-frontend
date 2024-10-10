import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Play from './Play';

function Room({ globalsocket, roomName }) {
    const [userName, setUserName] = useState('testuser');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (globalsocket && typeof globalsocket.on === 'function') {
            globalsocket.on('message', (message) => {
                setMessages((prevMessages) => [...prevMessages, message.msg]);
            });

            return () => {
                globalsocket.off('message');
            };
        }
    }, [globalsocket]);

    const sendMessage = () => {
        globalsocket.emit('message', { room: roomName, msg: message, username: userName });
        setMessage('');
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (globalsocket && message) {
            globalsocket.emit('message', { room: roomName, msg: message, username: userName });
            setMessage('');
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
                <Play socket={globalsocket}/>
            </div>
        </div>
    );
}

export default Room;
