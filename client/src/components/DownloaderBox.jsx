import { useState, useEffect, useRef } from "react"; // Added useRef
import axios from "axios";
import {
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Download,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function DownloaderBox({
  title = "Social Video",
  placeholder = "Paste link here (e.g. https://youtube.com/...)",
  paragraph = "Download videos and reels from Facebook, Instagram, YouTube, Twitter (X), TikTok, and more in high quality with a fast and easy online video downloader."
}) {
  // --- States ---
  const [url, setUrl] = useState("");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState({ mp4: false, mp3: false });
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  // UseRef to track interval cleanup
  const pollInterval = useRef(null);

  // --- Platform Icons Configuration ---
  const platforms = [
    { name: "YouTube", icon: <Youtube size={20} />, color: "hover:text-red-500" },
    { name: "Instagram", icon: <Instagram size={20} />, color: "hover:text-pink-500" },
    { name: "Facebook", icon: <Facebook size={20} />, color: "hover:text-blue-500" },
    { name: "Twitter", icon: <Twitter size={20} />, color: "hover:text-sky-400" },
  ];

  // --- Fetch Video Details ---
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
      const response = await axios.post("/api/info", {
        url: url
      });
      if (response.data) {
        setVideo({
          title: response.data.title,
          thumbnail: response.data.thumbnail,
          video_id: response.data.video_id,
          url: response.data.url
        });
      }
    } catch (err) {
      setError("❌ Backend unreachable or invalid link.");
    } finally {
      setLoading(false);
    }
  };

  // --- Updated Real-Time Download Handler ---
  const handleDownload = async (format) => {
    if (!video || !video.video_id) return;

    setDownloading(prev => ({ ...prev, [format]: true }));
    setProgress(0);
    setStatusMessage(`⏳ Preparing ${format.toUpperCase()}...`);

    // Clear any existing interval
    if (pollInterval.current) clearInterval(pollInterval.current);

    // 1. Start Polling Logic
    pollInterval.current = setInterval(async () => {
      try {
        const res = await axios.get(`/api/progress/${video.video_id}`);


        if (res.data.progress > 0) {
          setProgress(res.data.progress);
          // If merging stage
          if (res.data.progress >= 95 && res.data.progress < 100) {
            setStatusMessage("⚡ Merging high quality files...");
          }
        }

        // 2. DOWNLOAD TRIGGER: Jab 100% ho aur filename mil jaye
        if (res.data.progress === 100 && res.data.filename) {
          clearInterval(pollInterval.current);

          // Force download using dynamic link (Hindi/Special characters fix)
          const downloadUrl = `/api/file/${encodeURIComponent(res.data.filename)}`;

          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', res.data.filename);
          document.body.appendChild(link);
          link.click();
          link.remove();

          setStatusMessage("✅ Download Started!");
          setDownloading({ mp4: false, mp3: false });
        }
      } catch (e) {
        console.log("Polling server...");
      }
    }, 800);

    // 3. Start Backend Download Task
    try {
      await axios.post("/api/download", {
        url: video.url,
        format: format,
        video_id: video.video_id
      });

    } catch (err) {
      setError("❌ Server Error");
      clearInterval(pollInterval.current);
      setDownloading({ mp4: false, mp3: false });
    }
  };

  const downloadThumbnail = async () => {
    try {
      const response = await fetch(
        `/api/thumbnail?url=${encodeURIComponent(video.thumbnail)}`
      );

      if (!response.ok) throw new Error("Failed to fetch from backend");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "thumbnail.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-slate-900 overflow-hidden text-slate-200">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full -z-10 animate-pulse"></div>

      <div className="w-full max-w-2xl space-y-10 z-10">

        <div className="space-y-4 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white drop-shadow-2xl">
            {title} <span className="text-blue-500 italic">PRO</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium">
            {paragraph}
          </p>
        </div>

        <div className="space-y-5">
          <div className="relative group">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={placeholder}
              className="w-full p-6 pl-8 rounded-3xl bg-slate-800/50 border-2 border-slate-700/50 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-white backdrop-blur-xl shadow-2xl"
            />
          </div>

          <button
            onClick={fetchVideo}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white p-6 rounded-3xl font-extrabold text-xl shadow-2xl shadow-blue-600/20 transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-4"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : null}
            {loading ? "Analyzing Link..." : "Get Video Details"}
          </button>
        </div>

        {(downloading.mp4 || downloading.mp3) && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between text-sm font-bold text-blue-400 px-2">
              <span>Server Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-5 overflow-hidden border border-slate-700 p-1 shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="min-h-[60px] flex items-center justify-center">
          {error && (
            <div className="w-full flex items-center gap-3 text-red-400 bg-red-400/5 border border-red-400/20 p-5 rounded-2xl">
              <AlertCircle size={20} /> {error}
            </div>
          )}

          {statusMessage && !error && (
            <div className={`w-full p-5 rounded-2xl font-bold border flex items-center justify-center gap-3 transition-all ${statusMessage.includes('✅')
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse'
              }`}>
              {statusMessage.includes('✅') ? <CheckCircle size={22} /> : <Loader2 size={22} className="animate-spin" />}
              {statusMessage}
            </div>
          )}
        </div>

        {video && (
          <div className="mt-6 bg-slate-800/40 border border-slate-700/50 p-8 rounded-[40px] backdrop-blur-2xl animate-in zoom-in duration-500 shadow-3xl">
            <div className="relative group overflow-hidden rounded-3xl mb-6 shadow-2xl">
              <img
                src={video.thumbnail}
                referrerPolicy="no-referrer"
                className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Video Thumbnail"
                onError={(e) => { e.target.src = "https://placehold.co/640x360/1e293b/475569?text=Video+Ready"; }}
              />
            </div>

            <button
              onClick={downloadThumbnail}
              className="group w-full cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-2xl font-black transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              DOWNLOAD THUMBNAIL
            </button>


            <h2 className="mt-4 font-bold text-2xl text-white mb-8 line-clamp-2 leading-tight tracking-tight">
              {video.title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <button
                onClick={() => handleDownload("mp4")}
                disabled={downloading.mp4 || downloading.mp3}
                className="group bg-emerald-600 hover:bg-emerald-500 text-white p-5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {downloading.mp4 ? <Loader2 className="animate-spin" size={24} /> : <Download size={24} />}
                {downloading.mp4 ? "Processing..." : "DOWNLOAD MP4"}
              </button>

              <button
                onClick={() => handleDownload("mp3")}
                disabled={downloading.mp3 || downloading.mp4}
                className="group bg-slate-700 hover:bg-slate-600 text-white p-5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {downloading.mp3 ? <Loader2 className="animate-spin" size={24} /> : <Download size={24} />}
                {downloading.mp3 ? "Converting..." : "DOWNLOAD MP3"}
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-8 pt-10 border-t border-slate-800/50">
          <p className="text-slate-500 text-sm w-full text-center font-bold tracking-widest uppercase mb-2">Engines Ready</p>
          {platforms.map((p, i) => (
            <div key={i} className={`flex items-center gap-3 text-slate-400 transition-all cursor-default scale-110 ${p.color}`}>
              {p.icon} <span className="text-xs font-black uppercase tracking-tighter">{p.name}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}