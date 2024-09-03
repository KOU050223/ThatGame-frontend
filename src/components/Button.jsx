import React from 'react';

// Buttonコンポーネントの定義
// label: ボタンに表示されるテキスト
// url: データを送信するエンドポイントのURL
// data: 送信する特定のデータ
const Button = ({ label, url, data,onClick }) => {

  // handleClick関数を定義
  const handleClick = async () => {
    try {
        if (onClick){
            onClick()
        }
        console.log('押された')
        console.log(url)
        console.log(data)
        // FlaskサーバーにPOSTリクエストを送信
        const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // 指定されたデータを送信
        });
      
        // リクエストが成功したかどうかをチェック
        if (response.ok) {
            console.log('データが正常に送信されました');
        } else {
            console.error('データの送信に失敗しました');
        }
        } catch (error) {
        console.error('エラーが発生しました:', error);
    }
  };

  // ボタンのレンダリング
  return (
    <button onClick={handleClick}>
      {label}
    </button>
  );
};

export default Button;
