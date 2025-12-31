import { Link } from "react-router-dom";
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-gray-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-center md:text-left">

          {/* 🔹 LOGO + SEO TEXT */}
          <div>
            <h2 className="text-2xl font-black text-blue-400">
              Social Video Downloader
            </h2>
            <p className="text-sm mt-3 text-gray-400 leading-relaxed">
              Download videos and audio from YouTube, Instagram, Facebook,
              Twitter and more. Fast, free & secure social media downloader.
            </p>

            {/* SEO KEYWORDS (hidden but readable) */}
            <p className="sr-only">
              youtube video downloader, instagram reels downloader,
              facebook video downloader, mp3 mp4 downloader
            </p>
          </div>

          {/* 🔹 FOOTER MENU (SEO INTERNAL LINKS) */}
          <ul className="flex flex-col items-center justify-center gap-4 font-semibold ">
            <li>
              <Link to="/" className="hover:text-blue-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/youtube" className="hover:text-blue-400 transition">
                YouTube Downloader
              </Link>
            </li>
            <li>
              <Link to="/instagram" className="hover:text-blue-400 transition">
                Instagram Downloader
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-blue-400 transition">
                Terms & Conditions
              </Link>
            </li>
          </ul>

          {/* 🔹 ANIMATED SOCIAL ICONS */}
          <div className="flex justify-center md:justify-end gap-5 text-2xl">
            <a
              href="#"
              aria-label="YouTube"
              className="hover:text-red-500 transition transform hover:scale-125 hover:rotate-6 animate-pulse"
            >
              <FaYoutube />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-pink-500 transition transform hover:scale-125 hover:-rotate-6"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-blue-500 transition transform hover:scale-125 hover:rotate-6"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-sky-400 transition transform hover:scale-125 hover:-rotate-6"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* 🔹 BOTTOM BAR */}
        <div className="mt-10 border-t border-slate-800 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Social Downloader • All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
