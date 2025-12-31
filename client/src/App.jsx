import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Youtube from "./pages/Youtube";
import Instagram from "./pages/Instagram";
import Twitter from "./pages/Twitter";
import Facebook from "./pages/Facebook";
import TikTok from "./pages/TikTok";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-gray-300">
     {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow py-14">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/youtube" element={<Youtube />} />
          <Route path="/instagram" element={<Instagram />} />
          <Route path="/twitter" element={<Twitter />} />
          <Route path="/facebook" element={<Facebook />} />
          <Route path="/tiktok" element={<TikTok />} />
        </Routes>
      </main>
      
    {/* Footer */}
      <Footer />
    </div>
  );
}
