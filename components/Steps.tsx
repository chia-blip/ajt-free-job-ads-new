
import React from 'react';

const Steps: React.FC = () => {
  const steps = [
    { title: 'Step 1: Create Job Ad', desc: 'Submit your details and prepare your internship job ad.', icon: '📝' },
    { title: 'Step 2: Publish to Multiple Job Platforms', desc: 'Your internship ad goes live instantly after your company is verified.', icon: '📢' },
    { title: 'Step 3: Hire Fast', desc: 'Shortlist, interview, and hire your intern.', icon: '🚀' }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Post in 3 Easy Steps</h2>
          <p className="text-slate-600 max-w-xl mx-auto">We've removed the bureaucracy. Just enter what you need and find your intern.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="relative p-8 rounded-3xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all text-center group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform inline-block">{step.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              {idx < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-6 translate-y-[-50%] text-gray-200">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;
