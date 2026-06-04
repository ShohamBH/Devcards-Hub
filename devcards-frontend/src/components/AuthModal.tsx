import React from 'react';
import { X, Mail } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInWithGithub: () => void;
  onSignInWithGoogle: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSignInWithGithub,
  onSignInWithGoogle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900/90 border border-zinc-700/70 rounded-2xl p-8 shadow-2xl w-full max-w-md relative animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-3">
            Secure Your DevCard
          </h2>
          <p className="text-zinc-300 text-base leading-relaxed">
            Sign in to claim your card, edit it anytime, and manage your professional profile with ease.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onSignInWithGithub}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-all duration-200 border border-zinc-700 shadow-md transform hover:scale-[1.01]"
          >
            <span className="font-bold">󰊤</span>
            Sign in with GitHub
          </button>
          <button
            onClick={onSignInWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-all duration-200 border border-zinc-700 shadow-md transform hover:scale-[1.01]"
          >
            <Mail size={20} />
            Sign in with Google
          </button>
        </div>

        <p className="text-zinc-500 text-xs mt-8 text-center">
          Your data is safe and secured with Supabase. You can create cards anonymously too!
        </p>
      </div>
    </div>
  );
};
