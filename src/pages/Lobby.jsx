import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Lobby({ globalsocket }) {
    const [roomName, setRoomName] = useState('');
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    const serverIP = "http://localhost:443";
    const roomsIP = `${serverIP}/rooms`;

    useEffect(() => {
        if (!globalsocket) {
            console.error("Socket is undefined");
            return;
        }
    
        globalsocket.on('room_list_update', (data) => {
            console.log("Received room_list_update:", data); // デバッグ用ログ
            if (data && data.roomName) {
                setRooms(prevRooms => [...prevRooms, data.roomName]);
            } else {
                console.error("Received data is malformed:", data);
            }
        });
    
        return () => {
            if (globalsocket) {
                globalsocket.off('room_list_update');
            }
        };
    }, [globalsocket]);

    useEffect(() => {
        fetch(roomsIP)
            .then(response => response.json())
            .then(data => setRooms(data))
            .catch(error => console.error('Error fetching rooms:', error));
    }, [roomsIP]);

    const handleCreateRoom = (e) => {
        e.preventDefault();
        if (globalsocket) {
            globalsocket.emit('create_room', { roomName: roomName });
            setRoomName('');
        } else {
            console.error("Socket is not defined");
        }
    };

    const handleRoomClick = (room) => {
        navigate(`/room/${room}`);
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
                        <button onClick={() => handleRoomClick(room)}>{room}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Lobby;
