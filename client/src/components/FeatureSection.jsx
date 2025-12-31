import { Zap, ShieldCheck, Monitor, Music } from "lucide-react"; 

const features = [
  {
    title: "High Quality",
    desc: "Download videos in the highest available resolution, up to 4K.",
    icon: <Monitor className="w-8 h-8 text-blue-500" />,
  },
  {
    title: "MP3 Conversion",
    desc: "Extract high-quality audio from any video instantly.",
    icon: <Music className="w-8 h-8 text-purple-500" />,
  },
  {
    title: "Fast & Free",
    desc: "No registration or subscription needed. Unlimited downloads.",
    icon: <Zap className="w-8 h-8 text-yellow-500" />,
  },
  {
    title: "Safe & Secure",
    desc: "We don't store your data. Safe browsing guaranteed.",
    icon: <ShieldCheck className="w-8 h-8 text-green-500" />,
  },
];

export function FeaturesSection() {
  return (
    <div className="bg-slate-900 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">Why Choose Us?</h2>
          <p className="text-slate-400">The most powerful and simple downloader on the web.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-blue-500 transition-all group">
              <div className="mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}