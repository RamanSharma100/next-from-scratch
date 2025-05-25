'use client';

import { FC, useState } from 'react';

const HomePage: FC = () => {
  const [theme, setTheme] = useState('light');
  return (
    <div>
      <h1>App Router Home Page</h1>
      <button
        onClick={() => {
          setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
        }}>
        {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      </button>
    </div>
  );
};

export default HomePage;
