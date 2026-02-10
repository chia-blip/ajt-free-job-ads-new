
import React from 'react';

const UniversityPartners: React.FC = () => {
  const handleCTAClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Headline */}
        <div className="inline-block px-4 py-1 rounded-full bg-white text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-slate-100 shadow-sm">
          Trusted by Academic Institutions
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-10 tracking-tighter leading-tight max-w-4xl mx-auto">
          Hire Top Talents from <span className="text-[#F59E0B]">Premium Malaysian Universities</span>
        </h2>
        
        {/* Description */}
        <div className="max-w-3xl mx-auto space-y-6 mb-16">
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            AJobThing is the bridge between industry leaders and the nation's brightest minds. We partner directly with university career centers to ensure you get high-quality applications.
          </p>
        </div>

        {/* University Logos Grid Container */}
        <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl shadow-slate-200/50 border border-slate-100 mb-16 group">
          <img 
            src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-66802fee-0409-457b-a27f-ff7421d01683.png" 
            alt="University Network" 
            className="w-full max-w-5xl mx-auto h-auto object-contain select-none transition-all duration-700 group-hover:scale-[1.02]"
          />
        </div>

        {/* Call to Action Button */}
        <div className="flex justify-center">
          <a 
            href="#post-job"
            onClick={handleCTAClick}
            className="group flex items-center gap-3 px-12 py-6 bg-amber-500 hover:bg-amber-600 text-white text-xl font-black rounded-3xl transition-all transform hover:scale-105 shadow-2xl shadow-amber-200"
          >
            Hire Interns Now
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default UniversityPartners;