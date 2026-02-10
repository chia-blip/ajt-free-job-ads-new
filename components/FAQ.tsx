
import React, { useState } from 'react';

const FAQItem: React.FC<{ question: string; answer: React.ReactNode }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-start text-left transition-colors group"
      >
        <span className="text-lg font-bold text-[#F59E0B] group-hover:opacity-80 transition-opacity pr-4">{question}</span>
        <span className={`mt-1 transform transition-transform duration-300 text-[#F59E0B] flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="text-slate-600 leading-relaxed text-base whitespace-pre-line font-medium">
          {answer}
        </div>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "Is internship posting really free?",
      answer: "Yes. All internship roles are free to post on AJobThing — no hidden charges."
    },
    {
      question: "What types of internship jobs qualify?",
      answer: "Any role suitable for students, including: Marketing, Design, HR, Admin, Finance, IT, Social Media, Operations, Sales."
    },
    {
      question: "Do internships require a minimum allowance?",
      answer: "Yes. MySIP guidelines suggest:\n\n• RM600/month (Degree/Master)\n• RM500/month (Diploma/SKM)"
    },
    {
      question: "What if I need full-time staff later?",
      answer: (
        <>
          If you use all your free intern job ads, you can:
          {"\n\n"}• Buy job ads package for freelance roles.
          {"\n"}• Or use ala carte job ad for other job types like full-time or HQ positions.
          {"\n\n"}If you're unsure which category fits your job, our <a href="https://wa.link/nbynp5" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold">hiring support team</a> is happy to help.
        </>
      )
    },
    {
      question: "How many free internship jobs can I post?",
      answer: "You can post up to 1 free internship job ad."
    },
    {
      question: "Do internship ads follow the new 1:3 internship policy?",
      answer: "Yes. If your company hires expatriates or plans to, internship placements help you comply with the 1:3 Internship Policy."
    },
    {
      question: "Can I receive tax deductions for hiring interns?",
      answer: "Yes — if your internship meets MySIP requirements, you may qualify for double tax deduction on intern allowances and certain expenses."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100">
            Support Center
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Everything you need to know about our free internship posting service.
          </p>
        </div>
        
        <div className="bg-[#F9FAFB] rounded-[2.5rem] p-8 md:p-12 border border-gray-50 shadow-sm">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="mt-16 text-center bg-[#F59E0B] rounded-[2.5rem] p-10 md:p-14 text-white shadow-2xl shadow-amber-500/20 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-4">Still have questions?</h3>
            <p className="mb-8 text-white/90 font-medium text-lg max-w-2xl mx-auto">
              Can't find the answer you're looking for? Please reach out to our friendly team and we'll get back to you as soon as possible.
            </p>
            <div className="flex justify-center">
              <a 
                href="https://wa.link/s0ogyh" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-[#F59E0B] px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-amber-50 transition-all transform hover:scale-105 active:scale-95 shadow-xl"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
