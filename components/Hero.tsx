
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="flex flex-col items-start animate-in fade-in slide-in-from-right duration-1000">
      <div className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-amber-100">
        <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        Direct Access to Talent
      </div>
      
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-6 leading-[0.95] tracking-tighter">
        Hire Interns for <br />
        <span className="relative inline-block text-[#F59E0B] italic">
          FREE
        </span>
        <br />
        <span className="text-3xl md:text-5xl lg:text-6xl text-slate-400">Fast & Easy</span>
      </h1>
      
      <p className="text-lg md:text-xl text-slate-500 font-medium max-w-xl leading-relaxed mb-10">
        Find motivated students and fresh graduates ready to learn and support your team — at RM0 posting cost.
      </p>

      {/* Modern Feature List - AjobThing Color Palette */}
      <div className="flex flex-wrap gap-3 w-full">
        {[
          { 
            label: 'Unlimited Free Postings', 
            icon: '✨', 
            bgColor: 'bg-blue-600', 
            textColor: 'text-white'
          },
          { 
            label: '45-Day Visibility', 
            icon: '⏳', 
            bgColor: 'bg-amber-50', 
            textColor: 'text-amber-600'
          },
          { 
            label: 'Reach 1M+ Intern Candidates', 
            icon: '🛡️', 
            bgColor: 'bg-emerald-600', 
            textColor: 'text-white'
          }
        ].map((item, idx) => (
          <div 
            key={idx} 
            className={`flex items-center gap-2.5 ${item.bgColor} px-4 py-2.5 rounded-full shadow-lg shadow-black/5 transition-all hover:scale-105 active:scale-95 cursor-default`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className={`text-[11px] font-black ${item.textColor} uppercase tracking-wider whitespace-nowrap`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
