import React, { useState, useEffect } from 'react';
import Button from '../components/Button'
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Play = () => {

    const [message, setMessage] = useState('');

    useEffect(() => {
      socket.on('message', msg => {
        console.log(msg);
      });
    }, []);
  
    const sendMessage = () => {
      socket.emit(message);
      setMessage('');
    };
  
    return (
      <div>
        <h1>CCレモンゲームプレイ画面</h1>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
        <br />
        <Button 
          label="チャージ"      // ボタンに表示するテキスト
          url= 'http://localhost:5000/play'         // Flask側のエンドポイントURL
          data= {{action : 'チャージ'}}    // 送信する特定のデータ
        />
        <Button 
          label="アタック"      // ボタンに表示するテキスト
          url='http://localhost:5000/play'          // Flask側のエンドポイントURL
          data= {'チャージ'}   // 送信する特定のデータ
        />
        <Button 
          label="バリア"        // ボタンに表示するテキスト
          url='http://localhost:5000/play'          // Flask側のエンドポイントURL
          data= {{action : 'チャージ'}}    // 送信する特定のデータ
        />
      </div>
    );
};

export default Play;
