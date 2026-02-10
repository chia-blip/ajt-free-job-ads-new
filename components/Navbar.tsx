
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <a href="/" className="block">
              <img 
                src="https://files.ajobthing.com/assets/landing/a-job-thing-black.png" 
                alt="AJobThing" 
                className="h-8 md:h-10 w-auto hover:scale-105 transition-transform cursor-pointer"
              />
            </a>
          </div>
          <div className="hidden md:flex space-x-12 items-center">
            <a href="#how-it-works" className="text-slate-500 hover:text-blue-600 text-sm font-bold uppercase tracking-widest transition-colors">Process</a>
            <a href="#benefits" className="text-slate-500 hover:text-blue-600 text-sm font-bold uppercase tracking-widest transition-colors">Advantages</a>
            <a href="#faq" className="text-slate-500 hover:text-blue-600 text-sm font-bold uppercase tracking-widest transition-colors">Support</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
