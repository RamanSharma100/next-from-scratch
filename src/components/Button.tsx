'use client';

import { useState } from 'react';

const Button = () => {
  const [count, setCount] = useState(0);

  return (
    <button
      onClick={() => setCount((prev) => prev + 1)}
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#0070f3',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
      }}>
      Clicked {count} times
    </button>
  );
};

export default Button;
