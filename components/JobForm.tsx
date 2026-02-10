
import React, { useState } from 'react';
import { JobFormData } from '../types';
import { appendToSheet } from '../services/googleSheets';

interface JobFormProps {
  onSuccess: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<JobFormData>({
    companyName: '',
    companyEmail: '',
    whatsapp: '',
    hiringPreference: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clickedRegister, setClickedRegister] = useState(false);
  const [clickedLogin, setClickedLogin] = useState(false);

  const hiringOptions = [
    "Yes, I'm hiring interns & full timers",
    "Only hiring interns",
    "I will hire full timers within 3 months"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.hiringPreference) {
      alert("Please select your hiring preference.");
      return;
    }
    setIsSubmitting(true);
    
    console.log('[v0] Submitting form data:', formData);
    
    // Map hiring preference to hiring_status format
    let hiringStatus = '';
    if (formData.hiringPreference === "Yes, I'm hiring interns & full timers") {
      hiringStatus = 'hiring full time & intern';
    } else if (formData.hiringPreference === "Only hiring interns") {
      hiringStatus = 'only intern';
    } else if (formData.hiringPreference === "I will hire full timers within 3 months") {
      hiringStatus = 'will hire both in 3 months';
    }
    
    // Send data to Google Sheets
    const sheetData = {
      timestamp: new Date().toISOString(),
      company_name: formData.companyName,
      email: formData.companyEmail,
      phone_number: `+60${formData.whatsapp}`,
      hiring_status: hiringStatus,
      click_register_pop_up_after_submit: clickedRegister ? 'yes' : 'no',
      click_login_pop_up_after_submit: clickedLogin ? 'yes' : 'no',
    };
    
    const success = await appendToSheet(sheetData);
    
    if (success) {
      console.log('[v0] Successfully submitted to Google Sheets');
    } else {
      console.log('[v0] Failed to submit to Google Sheets, but continuing...');
    }
    
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
      setFormData({
        companyName: '',
        companyEmail: '',
        whatsapp: '',
        hiringPreference: ''
      });
      setClickedRegister(false);
      setClickedLogin(false);
    }, 1500);
  };

  return (
    <div className="w-full bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 animate-in fade-in slide-in-from-left duration-700">
      {/* Form Header */}
      <div className="text-center mb-8">
        <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-[0.2em] mb-3">
          Free Forever
        </div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Post Your Job</h3>
        <p className="text-slate-400 font-medium text-xs">Reach 15,000+ candidates instantly</p>
        
        {/* Partner Logos */}
        <div className="flex justify-center mt-6">
          <img 
            src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-dafef9c8-72c6-4360-b7eb-dfc982aa5148.png" 
            alt="Partner Logos" 
            className="h-10 w-auto object-contain opacity-80"
          />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-900 ml-1 uppercase tracking-widest">Company Name</label>
          <input
            required
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g. Global Tech Inc."
            className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/5 transition-all outline-none text-slate-800 placeholder:text-slate-300 font-medium text-sm"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-900 ml-1 uppercase tracking-widest">Email</label>
          <input
            required
            type="email"
            name="companyEmail"
            value={formData.companyEmail}
            onChange={handleChange}
            placeholder="hiring@company.com"
            className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/5 transition-all outline-none text-slate-800 placeholder:text-slate-300 font-medium text-sm"
          />
        </div>

        {/* WhatsApp Phone Number */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-900 ml-1 uppercase tracking-widest">WhatsApp Contact</label>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold text-xs">
              <span className="text-base">🇲🇾</span> +60
            </div>
            <input
              required
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="12 345 6789"
              className="flex-1 px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/5 transition-all outline-none text-slate-800 placeholder:text-slate-300 font-medium text-sm"
            />
          </div>
        </div>

        {/* Hiring Full-time preference */}
        <div className="space-y-3 pt-2">
          <label className="text-[10px] font-black text-slate-900 block uppercase tracking-widest">Also hiring full-time?</label>
          <div className="grid grid-cols-1 gap-2">
            {hiringOptions.map(option => (
              <label key={option} className="cursor-pointer group">
                <input
                  type="radio"
                  name="hiringPreference"
                  value={option}
                  checked={formData.hiringPreference === option}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`px-5 py-3 rounded-xl border transition-all flex items-center gap-3 ${
                  formData.hiringPreference === option 
                    ? 'border-[#F59E0B] bg-amber-50/50 text-[#F59E0B] ring-2 ring-amber-500/10' 
                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                }`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    formData.hiringPreference === option ? 'border-[#F59E0B] bg-[#F59E0B]' : 'border-slate-200 bg-white'
                  }`}>
                    {formData.hiringPreference === option && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wide">{option}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-[1.25rem] font-black text-lg tracking-tight transition-all transform hover:-translate-y-1 active:scale-[0.98] mt-4 shadow-xl ${
            isSubmitting 
              ? 'bg-slate-200 cursor-not-allowed text-white shadow-none' 
              : 'bg-[#F59E0B] hover:bg-[#E68A00] text-white shadow-amber-100'
          }`}
        >
          {isSubmitting ? 'Posting...' : 'Submit & Post for FREE'}
        </button>

        {/* Register/Login Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-xs text-slate-400 font-medium">Already have an account?</p>
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => {
                setClickedRegister(true);
                console.log('[v0] Register button clicked');
                window.open('https://employer.ajobthing.com/register', '_blank');
              }}
              className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all text-xs font-bold uppercase tracking-wide"
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => {
                setClickedLogin(true);
                console.log('[v0] Login button clicked');
                window.open('https://employer.ajobthing.com/login', '_blank');
              }}
              className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all text-xs font-bold uppercase tracking-wide"
            >
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
