
import React from 'react';

const Benefits: React.FC = () => {
  const handleCTAClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const benefits = [
    { 
      title: 'Double Tax Deduction', 
      desc: "Under the MySIP Programme, hiring interns can directly reduce your company's taxable income.", 
      icon: '💰' 
    },
    { 
      title: '1:3 Internship Policy', 
      desc: 'Starting 2025, companies must provide 3 internship roles for every 1 expatriate they hire.', 
      icon: '⚖️' 
    },
    { 
      title: 'Help Young Talent Grow', 
      desc: "By hiring interns, you support Malaysia's future workforce and grow your own talent pipeline.", 
      icon: '🚀' 
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start gap-16">
          <div className="lg:w-1/3">
            <div className="inline-block px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-500/20">
              Strategic Advantage
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-[1.1] tracking-tighter">
              Why Companies Need <br />
              <span className="text-[#F59E0B]">Interns Today</span>
            </h2>
            
            {/* Supporting list for the left column - Cleaned up */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></div>
                Pipeline for Fresh Talent
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></div>
                Future-Proof Your Team
              </div>
            </div>
          </div>
          
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => (
              <div 
                key={idx} 
                className="bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-700/50 hover:border-[#F59E0B]/50 transition-all duration-500 group"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500 inline-block">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-[#F59E0B] transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-slate-400 font-medium leading-relaxed text-sm">
                  {benefit.desc}
                </p>
              </div>
            ))}
            
            {/* CTA Card to complete the grid */}
            <div 
              onClick={handleCTAClick}
              className="bg-[#F59E0B] p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-amber-600 transition-all transform hover:scale-[1.02] shadow-2xl shadow-amber-900/20"
            >
               <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 text-white">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
               </div>
               <h4 className="text-white font-black text-xl mb-2">Ready to hire?</h4>
               <p className="text-white/80 text-xs font-bold mb-6">Post your internship ad for RM0</p>
               <a href="#post-job" className="bg-white text-[#F59E0B] px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:shadow-lg transition-all">
                 Post Free Ad Now
               </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;