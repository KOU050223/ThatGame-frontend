import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Room from './pages/Room';
import Play from './pages/Play'
import Lobby from './pages/Lobby';
import io from 'socket.io-client';

const socket = io('https://thatgame.azurewebsites.net',
  {
  secure:true,
  transports:['websocket','polling'],
  timeout:20000,
}
);

const App = () => {
  return (
    <div>
      <Router>
            <Routes>
                <Route path="/" element={<Lobby />} />
                <Route path="/room/:roomName" element={<Room />} />
                <Route path="/play" element={<Play />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
