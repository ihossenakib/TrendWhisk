import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-16" aria-label="Loading ideas">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
      <p className="text-slate-300 text-lg">Whisking up fresh ideas...</p>
    </div>
  );
};

export default LoadingSpinner;
