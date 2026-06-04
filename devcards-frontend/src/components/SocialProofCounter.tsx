import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { getCardsCount } from '../lib/api';

interface SocialProofCounterProps {
  variant?: 'full' | 'badge';
}

export const SocialProofCounter: React.FC<SocialProofCounterProps> = ({ variant = 'full' }) => {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      setIsLoading(true);
      try {
        const totalCount = await getCardsCount();
        setCount(totalCount);
      } catch (err) {
        console.error('Failed to fetch card count:', err);
        setCount(50);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();
  }, []);

  // Minimal Badge Variant (for hero section)
  if (variant === 'badge') {
    return (
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 backdrop-blur-sm">
          <Zap size={16} className="text-amber-400" />
          {isLoading ? (
            <span className="h-4 w-32 bg-slate-700 rounded animate-pulse"></span>
          ) : (
            <span className="text-sm font-semibold text-slate-200">
              ⚡ Over <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-bold">{count?.toLocaleString() || '50'}</span> developer profiles generated live
            </span>
          )}
        </div>
      </div>
    );
  }

  // Full Variant (default)
  return (
    <div className="mb-10 mx-auto max-w-3xl">
      <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="text-center">
            <p className="text-slate-200 text-sm md:text-base font-semibold flex items-center justify-center gap-2">
              <Zap size={16} className="text-amber-400 shrink-0" />
              {isLoading ? (
                <span className="h-5 w-48 bg-slate-700 rounded inline-block"></span>
              ) : (
                <>
                  <span>
                    {count && count > 0
                      ? `Join ${count.toLocaleString()} developers who have created their DevCard! 🚀`
                      : `Join our community of developers creating beautiful DevCards! 🚀`}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
