import { useState } from "react";
import axios from "axios";
import { Youtube, Instagram, Facebook, Twitter, Download, Loader2, CheckCircle } from "lucide-react";

export default function DownloaderBox({
  title = "Social Video",
  placeholder = "Paste link here (e.g. https://youtube.com/...)",
}) {
  const [url, setUrl] = useState("");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(""); 
  const [error, setError] = useState("");

  const platforms = [
    { name: "YouTube", icon: <Youtube />, color: "hover:text-red-500" },
    { name: "Instagram", icon: <Instagram />, color: "hover:text-pink-500" },
    { name: "Facebook", icon: <Facebook />, color: "hover:text-blue-500" },
    { name: "Twitter", icon: <Twitter />, color: "hover:text-sky-400" },
  ];

  const fetchVideo = async () => {
    if (!url) {
      setError("❌ Bhai URL to daal pehle");
      return;
    }
    setError("");
    setVideo(null);
    setStatusMessage("");
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/info", { url });
      setVideo({ ...res.data, url });
    } catch (err) {
      setError("❌ Backend unreachable or invalid link");
    }
    setLoading(false);
  };

  const handleDownload = async (format) => {
    setDownloading(true);
    setStatusMessage("⏳ Downloading... please wait"); 
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/download", {
        url: video.url,
        format,
      });

      if (res.data.status === "success") {
        const fileName = res.data.filename;
        const downloadUrl = `http://127.0.0.1:8000/file/${encodeURIComponent(fileName)}`;

   
        const response = await fetch(downloadUrl);
        const blob = await response.blob();
        const bUrl = window.URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = bUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(bUrl);

       
        setStatusMessage("✅ Video Downloaded Successfully!");
        
        
        setTimeout(() => setStatusMessage(""), 5000);
      } else {
        setError("❌ Error: " + res.data.message);
        setStatusMessage("");
      }
    } catch (err) {
      setError("❌ Download failed. Check backend.");
      setStatusMessage("");
    }
    setDownloading(false);
  };

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 pt-10 bg-slate-900 overflow-hidden">
  
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/20 blur-[120px] rounded-full -z-10"></div>

      <div className="w-full max-w-2xl space-y-8 z-10 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white text-center">
            {title} <span className="text-blue-500">Downloader</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-lg mx-auto">
            Fast, Free and High Quality social media video downloads.
          </p>
        </div>

        
        <div className="space-y-4">
          <div className="relative group">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={placeholder}
              className="w-full p-5 pl-6 rounded-2xl bg-slate-800/80 border border-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-white backdrop-blur-sm shadow-xl"
            />
          </div>

          <button
            onClick={fetchVideo}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : null}
            {loading ? "Fetching High Quality..." : "Get Video Details"}
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-6 pt-4 border-t border-slate-800">
          <p className="text-slate-500 text-sm w-full mb-2">Supported Platforms:</p>
          {platforms.map((p, i) => (
            <div key={i} className={`flex items-center gap-2 text-slate-500 transition-colors cursor-default ${p.color}`}>
              {p.icon} <span className="text-sm font-medium">{p.name}</span>
            </div>
          ))}
        </div>

        
        <div className="min-h-[50px]">
            {error && (
              <div className="text-red-400 bg-red-400/10 border border-red-400/20 p-4 rounded-xl">
                {error}
              </div>
            )}
            
            {statusMessage && (
              <div className={`p-4 rounded-xl font-bold border transition-all animate-bounce flex items-center justify-center gap-2 ${
                statusMessage.includes('✅') 
                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
              }`}>
                {statusMessage.includes('✅') ? <CheckCircle size={20} /> : <Loader2 size={20} className="animate-spin" />}
                {statusMessage}
              </div>
            )}
        </div>

        
        {video && (
          <div className="mt-4 bg-slate-800/50 border border-slate-700 p-6 rounded-3xl backdrop-blur-md animate-in fade-in zoom-in duration-300 shadow-2xl">
            <img 
               src={video.thumbnail} 
               referrerPolicy="no-referrer"
               className="rounded-2xl mb-4 w-full aspect-video object-cover shadow-2xl" 
               alt="thumbnail" 
               onError={(e) => { e.target.src = "https://placehold.co/600x400/1e293b/fff?text=Ready+to+Download"; }}
            />
            <h2 className="font-bold text-xl text-white mb-6 line-clamp-2 text-left">{video.title}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleDownload("mp4")}
                disabled={downloading}
                className="bg-green-600 hover:bg-green-500 p-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {downloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />} 
                {downloading ? "Processing..." : "Download MP4"}
              </button>
              <button
                onClick={() => handleDownload("mp3")}
                disabled={downloading}
                className="bg-slate-700 hover:bg-slate-600 p-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {downloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />} 
                {downloading ? "Processing..." : "Download MP3"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}