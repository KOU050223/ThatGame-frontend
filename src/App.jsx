import React, { useState, useEffect } from 'react';
import Play from './pages/Play'
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  return (
    <div>
      <Play/>
    </div>
  );
}

export default App;
