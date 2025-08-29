
import React from 'react';
import type { Idea } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

interface IdeaRowProps {
  idea: Idea;
  index: number;
  isCopied: boolean;
  onCopy: (prompt: string) => void;
}

const IdeaRow: React.FC<IdeaRowProps> = ({ idea, index, isCopied, onCopy }) => {
  
  const handleCopyClick = () => {
    if (isCopied || !navigator.clipboard) return;
    navigator.clipboard.writeText(idea.prompt).then(() => {
        onCopy(idea.prompt);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy prompt.');
    });
  };

  return (
    <div className="bg-slate-800/50 ring-1 ring-white/10 rounded-lg p-4 shadow-md flex items-center gap-4 transition-colors duration-300 ease-in-out">
      <div className="text-xl font-bold text-indigo-400 w-12 text-center flex-shrink-0">{index + 1}.</div>
      <div className="flex-shrink-0">
        <button
          onClick={handleCopyClick}
          disabled={isCopied}
          className={`w-28 inline-flex items-center justify-center gap-x-2 rounded-md px-3 py-2 text-sm font-semibold shadow-sm transition-colors duration-200 ${
            isCopied
              ? 'bg-yellow-500 text-slate-900 cursor-default'
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
              Copy
            </>
          )}
        </button>
      </div>
      <div className="flex-grow">
        <h3 className="text-md font-bold text-emerald-400">{idea.object}</h3>
        <p className="mt-1 text-slate-400 font-mono text-xs">
          {idea.prompt}
        </p>
        <p className="mt-2 text-xs text-sky-400/80">
          <span className="font-semibold text-sky-300">Keywords:</span> {idea.keywords.join(', ')}
        </p>
      </div>
    </div>
  );
};

export default IdeaRow;
