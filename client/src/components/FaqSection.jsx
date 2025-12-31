import { useState } from "react";

const faqs = [
  {
    q: "Is this service free to use?",
    a: "Yes, our downloader is 100% free and requires no registration or software installation."
  },
  {
    q: "Which platforms are supported?",
    a: "We currently support YouTube, Instagram, Facebook, Twitter, and TikTok."
  },
  {
    q: "Is there a limit on downloads?",
    a: "No! You can download as many videos as you want without any restrictions."
  }
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="bg-slate-900 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-700 rounded-lg overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left p-4 bg-slate-800 flex justify-between items-center text-white font-medium"
              >
                {faq.q}
                <span>{openIndex === i ? '−' : '+'}</span>
              </button>
              {openIndex === i && (
                <div className="p-4 bg-slate-800/40 text-slate-400 border-t border-slate-700">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}