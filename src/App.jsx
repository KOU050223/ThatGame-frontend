import React from 'react';
import Play from './pages/Play'
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
      <Play/>
    </div>
  );
}

export default App;
