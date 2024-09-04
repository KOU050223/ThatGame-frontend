import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Room from './pages/Room';
import Play from './pages/Play'
import Lobby from './pages/Lobby';
import io from 'socket.io-client';

const socket = io('http://172.17.9.141:5003');


function App() {
  useEffect(() => {
    // クライアントのIPアドレスを取得
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        console.log('Your IP address is:', data.ip);
      })
      .catch(error => {
        console.error('Error fetching the IP address:', error);
      });

    // ソケットイベントの例
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    // クリーンアップ: コンポーネントがアンマウントされたときに接続を切断
    return () => {
      socket.disconnect();
    };
  }, []);

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
