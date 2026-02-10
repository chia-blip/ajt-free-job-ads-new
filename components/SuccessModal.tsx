
import React from 'react';

interface SuccessModalProps {
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl animate-in fade-in zoom-in duration-300 w-full max-w-lg flex flex-col max-h-[95vh] lg:max-h-[90vh]">
        
        {/* Top Right Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto p-6 md:p-10 custom-scrollbar text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-[#E6F9F1] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Headline */}
          <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            🎉 Congratulations! <br/> 
            You’ve unlocked a <span className="text-blue-600">FREE</span> Intern Job Ad! 🎉
          </h2>

          {/* Content Body */}
          <div className="space-y-4">
            {/* Section 1: Login */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <p className="text-slate-900 font-bold mb-3 text-base">Already have an account on AJobThing?</p>
              <a 
                href="https://epca.in/ajt-freeja-login" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block w-full py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-100 mb-2"
              >
                Login and Claim
              </a>
              <p className="text-slate-500 text-[11px] font-medium px-4">
                <span className="text-slate-900 font-bold">Claim Free Internship Job Ad and Post Now</span>
              </p>
            </div>

            {/* Section 2: Register */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <p className="text-slate-900 font-bold mb-3 text-base">Don’t have an account yet?</p>
              <a 
                href="https://epca.in/ajt-freeja-reg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block w-full py-3 bg-[#0F172A] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md shadow-slate-100 mb-2"
              >
                Register and Claim
              </a>
              <p className="text-slate-500 text-[11px] font-medium px-4">
                Before posting free job ad, please register on AJobThing.com
              </p>
            </div>

            {/* Footer message */}
            <div className="pt-2">
              <p className="text-base font-bold text-slate-800 leading-tight">
                ✨ Post your FREE Intern on Maukerja and Ricebowl 🚀
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default SuccessModal;
