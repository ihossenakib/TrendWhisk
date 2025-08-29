import React, { useState, useCallback } from 'react';
import type { Idea } from './types';
import { generateTrendingIdeas } from './services/geminiService';
import Header from './components/Header';
import IdeaCard from './components/IdeaCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { SparklesIcon } from './components/icons/SparklesIcon';
import Welcome from './components/Welcome';

const App: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedObjects, setGeneratedObjects] = useState<Set<string>>(new Set());

  const handleGenerateIdeas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newIdeas = await generateTrendingIdeas(Array.from(generatedObjects));
      setIdeas(newIdeas);
      setGeneratedObjects(prevSet => {
        const newObjectNames = newIdeas.map(idea => idea.object);
        return new Set([...prevSet, ...newObjectNames]);
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

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorMessage message={error} />;
    }
    if (ideas.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {ideas.map((idea, index) => (
            <IdeaCard key={index} idea={idea} />
          ))}
        </div>
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
              id="983e3e4c-de6d-4c3f-8d9e-985c2c784927"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#983e3e4c-de6d-4c3f-8d9e-985c2c784927)" />
        </svg>

        <div className="max-w-7xl mx-auto py-8 sm:py-16">
          <Header />

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={handleGenerateIdeas}
              disabled={isLoading}
              className="relative inline-flex items-center gap-x-2 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg hover:bg-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              aria-label={isLoading ? 'Generating ideas' : 'Generate new ideas'}
              aria-live="polite"
            >
              <SparklesIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              {isLoading ? 'Generating...' : 'Generate New Ideas'}
            </button>
          </div>

          <main className="mt-8">
            {renderContent()}
          </main>
        </div>

        <footer className="text-center py-8 text-slate-500 text-sm">
            <p>Powered by Google Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;