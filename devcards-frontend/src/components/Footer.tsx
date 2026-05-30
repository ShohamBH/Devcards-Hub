import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 mt-auto border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 text-center">
        <p className="text-slate-400 text-sm">
          Created with <span className="text-teal-400 font-semibold">DevCards</span> by Shoham | {' '}
          <a 
            href="mailto:shoham.dahan.pro@gmail.com" 
            className="text-teal-400 hover:text-teal-300 transition-colors underline"
          >
            shoham.dahan.pro@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
