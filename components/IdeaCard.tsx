import React, { useState } from 'react';
import type { Idea } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

interface IdeaCardProps {
  idea: Idea;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    if (isCopied || !navigator.clipboard) return;
    navigator.clipboard.writeText(idea.prompt).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy prompt.');
    });
};


  return (
    <div className="bg-slate-800/50 ring-1 ring-white/10 rounded-xl p-6 shadow-lg flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
      <div>
        <h3 className="text-xl font-bold text-cyan-300">{idea.object}</h3>
        <p className="mt-3 text-slate-400 font-mono text-sm bg-slate-900 p-3 rounded-md break-words">
          {idea.prompt}
        </p>
      </div>
      <div className="mt-4">
        <button
          onClick={handleCopyClick}
          className={`w-full inline-flex items-center justify-center gap-x-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition-colors duration-200 ${
            isCopied
              ? 'bg-green-600 text-white cursor-default'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500'
          }`}
          aria-label={isCopied ? 'Prompt copied to clipboard' : 'Copy prompt to clipboard'}
        >
          {isCopied ? (
            <>
              <CheckIcon className="h-5 w-5" aria-hidden="true" />
              Copied!
            </>
          ) : (
            <>
              <ClipboardIcon className="h-5 w-5" aria-hidden="true" />
              Copy Prompt
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default IdeaCard;