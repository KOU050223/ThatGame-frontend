import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // useNavigateフックでnavigate関数を取得
import io from 'socket.io-client';

function Lobby() {
    const [roomName, setRoomName] = useState('');
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();  // useNavigateフックでnavigate関数を取得

    const serverIp = "http://172.17.9.141:5003";  // serverIpをここで定義
    const roomsIp = serverIp + "/rooms";
    const createroomIp = serverIp + "/create_room";
    
    useEffect(() => {
        // Socket.IOサーバーへの接続はuseEffect内で行う
        const socket = io(serverIp);

        // 初期ロード時に既存のルーム一覧を取得
        fetch(roomsIp)
            .then(response => response.json())
            .then(data => setRooms(data))
            .catch(error => console.error('Error fetching rooms:', error));

        // サーバーからのルーム更新通知を受け取る
        socket.on('room_list_update', (data) => {
            setRooms(prevRooms => [...prevRooms, data.room_name]);
        });

        // クリーンアップでソケット接続を閉じる
        return () => {
            socket.disconnect();
        };
    }, [roomsIp]);

    // フォーム送信ハンドラー
    const handleCreateRoom = (e) => {
        e.preventDefault();
        const socket = io(serverIp);  // 送信時に新しいSocket.IO接続を利用
        // サーバーに新しいルームを作成するリクエストを送信
        socket.emit('create_room', { room_name: roomName });
        setRoomName('');  // フォームをクリア
    };

    return (
        <div>
            <h1>Lobby</h1>
            <form onSubmit={handleCreateRoom}>
                <input 
                    type="text" 
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Room Name" 
                    required 
                />
                <button type="submit">Create Room</button>
            </form>

            <h2>Available Rooms</h2>
            <ul>
                {rooms.map((room, index) => (
                    <li key={index}>
                        <a href={`/room/${room}`}>{room}</a> {/* リンクでルームに遷移 */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Lobby;
