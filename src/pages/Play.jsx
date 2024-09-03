// import React, { useState, useEffect } from 'react';
// import Button from '../components/Button'
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000');

// const Play = () => {

//     const [message, setMessage] = useState('');

//     useEffect(() => {
//       socket.on('message', msg => {
//         console.log(msg);
//       });
//     }, []);
  
//     const sendMessage = () => {
//       socket.emit(message);
//       setMessage('');
//     };
  
//     return (
//       <div>
//         <h1>あのゲームプレイ画面</h1>
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button onClick={sendMessage}>Send</button>
//         <br />
//         <Button 
//           label="チャージ"      // ボタンに表示するテキスト
//           url= 'http://localhost:5000/play'         // Flask側のエンドポイントURL
//           data= {{data : 'チャージ'}}    // 送信する特定のデータ
//         />
//         <Button 
//           label="アタック"      // ボタンに表示するテキスト
//           url='http://localhost:5000/play'          // Flask側のエンドポイントURL
//           data= {{data:'アタック'}}   // 送信する特定のデータ
//         />
//         <Button 
//           label="バリア"        // ボタンに表示するテキスト
//           url='http://localhost:5000/play'          // Flask側のエンドポイントURL
//           data= {{data : 'バリア'}}    // 送信する特定のデータ
//         />
//       </div>
//     );
// };

// export default Play;

import Button from '../components/Button'
import React, { useState } from 'react';
import './play.css';

const Play = () => {
  const [charge, setCharge] = useState(3);
  const maxCharge = 5; // チャージの最大数

    const handleCharge = () => {
    if (charge < maxCharge) {
      setCharge(charge + 1);
    }
    }

    return (
        <div className="game-container">
        <div className="charge-container">
            <div className="charge-label">チャージ</div>
            <div className="charge-dots">
            {[...Array(charge)].map((_, index) => (
                <div key={index} className="charge-dot"></div>
            ))}
            </div>
        </div>
        <div className="opponent-hand">相手の手</div>
        <div className="actions">
            <Button 
                onClick={handleCharge}
                label="溜め"        // ボタンに表示するテキスト
                url='http://172.17.9.150:5000/play'          // Flask側のエンドポイントURL
                data= {{data : '溜め'}}    // 送信する特定のデータ
            />
            <Button 
                label="攻撃"        // ボタンに表示するテキスト
                url='http://172.17.9.150:5000/play'          // Flask側のエンドポイントURL
                data= {{data : '攻撃'}}    // 送信する特定のデータ
            />
            <Button 
                label="防御"        // ボタンに表示するテキスト
                url='http://172.17.9.150:5000/play'          // Flask側のエンドポイントURL
                data= {{data : '防御'}}    // 送信する特定のデータ
            />
        </div>
        </div>
    );
    };

export default Play;
