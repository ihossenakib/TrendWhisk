import React from 'react';

const Welcome: React.FC = () => {
  return (
    <div className="text-center max-w-2xl mx-auto mt-16">
      <h2 className="text-3xl font-bold text-white sm:text-4xl">
        Unlock Your Next Bestseller
      </h2>
      <p className="mt-4 text-lg text-slate-300">
        Welcome to TrendWhisk! Get instant, AI-curated ideas for 3D objects that are currently trending on Adobe Stock. Stop guessing, start creating.
      </p>
      <p className="mt-4 text-slate-400">
        Click the button below to generate your first batch of ideas.
      </p>
    </div>
  );
};

export default Welcome;
