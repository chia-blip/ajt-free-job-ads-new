
import React from 'react';

const RoleCategories: React.FC = () => {
  const handleCTAClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const roles = [
    { name: 'Marketing', icon: '📢', color: 'text-blue-500' },
    { name: 'HR & Admin', icon: '👥', color: 'text-blue-600' },
    { name: 'Creative & Design', icon: '🎨', color: 'text-pink-500' },
    { name: 'Accounting & Finance', icon: '📋', color: 'text-orange-600' },
    { name: 'Digital & IT', icon: '💻', color: 'text-slate-700' },
    { name: 'Operations & Sales', icon: '📊', color: 'text-amber-500' },
  ];

  return (
    <section className="py-20 bg-[#F59E0B] relative overflow-hidden">
      {/* Decorative subtle texture/blobs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Find the Right Interns Across <span className="relative inline-block">
              All Major Roles
              <div className="absolute -bottom-2 left-0 w-full h-1.5 bg-white rounded-full"></div>
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {roles.map((role, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center text-center shadow-[0_15px_40px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] group cursor-default"
            >
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-lg">
                {role.icon}
              </div>
              <span className="text-slate-900 font-black text-sm md:text-base leading-tight tracking-tight uppercase">
                {role.name.split(' & ').map((part, i) => (
                  <React.Fragment key={i}>
                    {part} {i === 0 && role.name.includes(' & ') && <br className="hidden lg:block" />}
                    {i === 0 && role.name.includes(' & ') && <span className="text-slate-400">&</span>}
                    {i === 0 && role.name.includes(' & ') && <br className="hidden lg:block" />}
                  </React.Fragment>
                ))}
                {!role.name.includes(' & ') && role.name}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <a 
            href="#post-job"
            onClick={handleCTAClick}
            className="inline-block bg-white text-[#F59E0B] px-12 py-4 rounded-full text-lg font-black tracking-tight shadow-xl hover:shadow-2xl hover:bg-slate-50 transition-all transform hover:scale-105 active:scale-95"
          >
            Post Intern Jobs for FREE
          </a>
        </div>
      </div>
    </section>
  );
};

export default RoleCategories;