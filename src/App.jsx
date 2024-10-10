import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Room from './pages/Room';
import Play from './pages/Play';
import Lobby from './pages/Lobby';
import io from 'socket.io-client';

const socket = io('http://localhost:443', {  // サーバーのURLとポートを指定
  transports: ['websocket'],
  secure: false,
  timeout: 20000,
});

const App = () => {
  let roomName = "test";

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Lobby globalsocket={socket} />} />
          <Route path="/room/:roomName" element={<Room globalsocket={socket} roomName={roomName} />} />
          <Route path="/play" element={<Play socket={socket} />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
