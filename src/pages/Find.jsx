import React, { useState, useEffect } from 'react';
import Button from '../components/Button'
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Find = () => {

  const [message, setMessage] = useState('');

    return (
      <div>
        <h1>あのゲーム待機場</h1>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
        <br />
        <Button 
          label="探す"      // ボタンに表示するテキスト
          url= 'http://localhost:5000/play'         // Flask側のエンドポイントURL
          data= {{data : 'チャージ'}}    // 送信する特定のデータ
        />
        
      </div>
    );
};

export default Find;
