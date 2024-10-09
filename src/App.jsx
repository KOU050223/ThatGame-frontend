import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Room from './pages/Room';
import Play from './pages/Play'
import Lobby from './pages/Lobby';
import io from 'socket.io-client';

const socket = io('http://localhost:443',
  {
  secure:true,
  transports:['websocket','polling'],
  timeout:20000,
}
);

const App = () => {
  useEffect(() => {

  });
  let roomname = "test"; 
  return (
    <div>
      <Router>
            <Routes>
                <Route path="/" element={<Lobby
                globalsocket = {socket}
                />} />
                <Route path="/room/:roomName" element={<Room                socket = {socket}
                roomname = {roomname}
                />} />
                <Route path="/play" element={<Play                 socket = {socket}
                />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
