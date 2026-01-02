import { useState } from "react";

const faqs = [
  {
    q: "Is this social video downloader free to use?",
    a: "Yes, this tool is absolutely free to use. You can download your videos and audio from all supported social media sites completely free."
  },
  {
    q: "Which social media platforms are supported?",
    a: "Our downloader is compatible with popular platforms such as Facebook, Instagram, YouTube, Twitter (X), and TikTok, among many others. Compatibility with Reddit and Pinterest is coming next."
  },
  {
    q: "Do I need to create an account to download videos?",
    a: "There is no need to register and log in. You can easily download your video by copying its link."
  },
  {
    q: "Can I download videos on mobile devices?",
    a: "Yes, this downloader is working well with cell phones, tablets, as well as computers. It is compatible with every browser."
  },
  {
    q: "Is it safe to use this video downloader?",
    a: "Well, the truth is that our platform is absolutely safe and secure. This is why we don't store your data or the files that you download."
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