
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JobForm from './components/JobForm';
import Steps from './components/Steps';
import Benefits from './components/Benefits';
import RoleCategories from './components/RoleCategories';
import UniversityPartners from './components/UniversityPartners';
import FAQ from './components/FAQ';
import SuccessModal from './components/SuccessModal';

const App: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      
      <main>
        {/* Main Hero Grid - Compact & Brand Aligned */}
        <section id="post-job" className="relative pt-20 lg:pt-24 pb-16 px-4 md:px-8 overflow-hidden scroll-mt-20">
          {/* Subtle Brand Background Blobs */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
            <div className="absolute top-[-5%] left-[-10%] w-[45%] h-[45%] bg-blue-50/50 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-amber-50/40 rounded-full blur-[100px]"></div>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
              
              {/* Left Column: Form - Clean & High */}
              <div className="lg:col-span-5 order-2 lg:order-1 lg:mt-2">
                <div className="relative">
                  <JobForm onSuccess={() => setShowSuccess(true)} />
                </div>
              </div>

              {/* Right Column: Hero Content & Fresh Grad Image */}
              <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
                <div className="text-left">
                  <Hero />
                </div>
                
                {/* Visual Content: Modern Image Container - Raised Position */}
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-100/50 group">
                  <div className="absolute inset-0 bg-blue-900/5 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img 
                    src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-cfb6e186-0fd2-43fa-80d0-f8c9be829962.png" 
                    alt="Happy interns at work" 
                    className="w-full h-[380px] lg:h-[440px] object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
                  />
                  {/* Floating Stat Badge */}
                  <div className="absolute bottom-6 right-6 z-20 bg-white/95 backdrop-blur-md px-6 py-4 rounded-3xl shadow-xl border border-white/50 animate-bounce-subtle">
                    <div className="text-blue-600 font-black text-2xl tracking-tight">98%</div>
                    <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Satisfaction</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <UniversityPartners />
        <Steps />
        <Benefits />
        <RoleCategories />
        <FAQ />

        <footer className="bg-slate-50 py-20 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
              <div className="space-y-4">
                <img 
                  src="https://files.ajobthing.com/assets/landing/a-job-thing-black.png" 
                  alt="AJobThing" 
                  className="h-8 w-auto mb-2"
                />
                <p className="text-slate-500 max-w-xs font-medium text-sm leading-relaxed">
                  The most modern way to connect ambitious interns with innovative companies across Southeast Asia.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-20">
                <div className="flex flex-col gap-4">
                  <span className="text-slate-900 font-bold text-sm uppercase tracking-widest">Product</span>
                  <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-left text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">Post Job</button>
                  <a href="#benefits" className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">Advantages</a>
                  <a href="#faq" className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">Support</a>
                </div>
                <div className="flex flex-col gap-4">
                  <span className="text-slate-900 font-bold text-sm uppercase tracking-widest">Company</span>
                  <a href="#" className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">About Us</a>
                  <a href="#" className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">Privacy</a>
                  <a href="#" className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">Terms</a>
                </div>
                <div className="flex flex-col gap-4">
                  <span className="text-slate-900 font-bold text-sm uppercase tracking-widest">Support</span>
                  <a href="#faq" className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">Help Center</a>
                  <a href="mailto:support@ajobthing.com" className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">Contact</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
      
      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;