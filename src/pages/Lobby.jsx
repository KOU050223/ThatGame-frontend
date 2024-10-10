import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Lobby({ globalsocket }) {
    const [roomName, setRoomName] = useState('');
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    const serverIp = "http://localhost:443";
    const roomsIp = `${serverIp}/rooms`;

    console.log("roomIp:",roomsIp);
    console.log("globalsocket",globalsocket);


    useEffect(() => {
        if (!globalsocket) {
            console.error("Socket is undefined");
            return;
        }

        globalsocket.on('room_list_update', (data) => {
            setRooms(prevRooms => [...prevRooms, data.room_name]);
        });

        return () => {
            if (globalsocket) {
                globalsocket.off('room_list_update');
            }
        };
    }, [globalsocket]);

    useEffect(() => {
        fetch(roomsIp)
            .then(response => response.json())
            .then(data => setRooms(data))
            .catch(error => console.error('Error fetching rooms:', error));
    }, [roomsIp]);

    const handleCreateRoom = (e) => {
        e.preventDefault();
        if (globalsocket) {
            globalsocket.emit('create_room', { room_name: roomName });
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
