import React from 'react';

// Buttonコンポーネントの定義
// label: ボタンに表示されるテキスト
// onClick: ボタンがクリックされたときに呼び出される関数
const Button = ({ label, onClick }) => {

  // handleClick関数を定義
  const handleClick = async () => {
    try {
      if (onClick) {
        onClick();
      }
      console.log('押された');
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  };

  // ボタンのレンダリング
  return (
    <button onClick={handleClick} aria-label={label}>
      {label}
    </button>
  );
};

export default Button;
