import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 text-center">
      <h1 className="text-5xl font-extrabold text-white tracking-tight">
        <span role="img" aria-label="light bulb" className="mr-3">💡</span>
        TrendWhisk
      </h1>
      <p className="mt-2 text-lg text-slate-400">
        AI-powered ideas for Adobe Stock, ready for your whisk.
      </p>
    </header>
  );
};

export default Header;
