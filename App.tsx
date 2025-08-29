
import React, { useState, useCallback } from 'react';
import type { Idea } from './types';
import { generateTrendingIdeas } from './services/geminiService';
import Header from './components/Header';
import IdeaRow from './components/IdeaRow';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { SparklesIcon } from './components/icons/SparklesIcon';
import Welcome from './components/Welcome';
import { DownloadIcon } from './components/icons/DownloadIcon';

const App: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [generatedObjects, setGeneratedObjects] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('generatedObjects');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [copiedPrompts, setCopiedPrompts] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('copiedPrompts');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const handleGenerateIdeas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newIdeas = await generateTrendingIdeas(Array.from(generatedObjects));
      setIdeas(newIdeas);
      setGeneratedObjects(prevSet => {
        const newObjectNames = newIdeas.map(idea => idea.object);
        const updatedSet = new Set([...prevSet, ...newObjectNames]);
        localStorage.setItem('generatedObjects', JSON.stringify(Array.from(updatedSet)));
        return updatedSet;
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [generatedObjects]);

  const handleCopyPrompt = useCallback((prompt: string) => {
    setCopiedPrompts(prevSet => {
        const newSet = new Set(prevSet);
        newSet.add(prompt);
        localStorage.setItem('copiedPrompts', JSON.stringify(Array.from(newSet)));
        return newSet;
    });
  }, []);

  const handleDownloadCSV = () => {
    const headers = ['Filename', 'Title', 'Keywords', 'Category', 'Releases'];
    const rows = ideas.map(idea => {
        const filename = 'image_filename.jpg';
        // Escape double quotes by doubling them and wrap field in quotes
        const title = `"${idea.object.replace(/"/g, '""')}"`;
        const keywords = `"${idea.keywords.join(', ')}"`;
        const category = '3';
        const releases = '';
        return [filename, title, keywords, category, releases].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    
    const now = new Date();
    const pad = (num: number) => num.toString().padStart(2, '0');
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    const csvFilename = `${timestamp}.csv`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', csvFilename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorMessage message={error} />;
    }
    if (ideas.length > 0) {
      const allCopied = copiedPrompts.size >= ideas.length;
      return (
        <>
          <div className="flex flex-col gap-4 mt-12">
            {ideas.map((idea, index) => (
              <IdeaRow 
                key={`${idea.object}-${index}`} 
                idea={idea} 
                index={index}
                isCopied={copiedPrompts.has(idea.prompt)}
                onCopy={handleCopyPrompt}
              />
            ))}
          </div>
          {allCopied && (
            <div className="mt-8 text-center">
                <button
                    onClick={handleDownloadCSV}
                    className="rounded-md bg-emerald-500 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 inline-flex items-center gap-x-2"
                >
                    <DownloadIcon className="h-6 w-6" />
                    Download CSV
                </button>
            </div>
          )}
        </>
      );
    }
    return <Welcome />;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <div className="relative isolate overflow-hidden px-6 lg:px-8">
        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="983e3e4c-de6d-4c3a-a85a-782d8d7cbfee"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#983e3e4c-de6d-4c3a-a85a-782d8d7cbfee)" />
        </svg>
        <div className="mx-auto max-w-4xl py-24 sm:py-32">
            <Header />
            <div className="mt-12 text-center">
              <button
                onClick={handleGenerateIdeas}
                disabled={isLoading}
                className="rounded-md bg-indigo-500 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-x-2"
              >
                <SparklesIcon className="h-6 w-6" />
                {isLoading ? 'Generating...' : 'Generate Trending Ideas'}
              </button>
            </div>
            <div className="mt-8">
              {renderContent()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;
