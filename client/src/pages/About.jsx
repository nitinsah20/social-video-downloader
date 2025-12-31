import { FaYoutube, FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import baner from "../assets/baner.webp";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 flex flex-col items-center">
      
     
      <section className="w-full max-w-7xl px-6 py-20 flex flex-col md:flex-row items-center gap-10">
   
        <div className="md:w-1/2 animate-fadeInLeft">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-400 mb-4">
            About Social Video Downloader
          </h1>
          <p className="text-gray-300 mb-6 leading-relaxed">
            We provide a fast, secure, and free platform to download videos and audio 
            from all your favorite social media platforms like YouTube, Instagram, Facebook, Twitter, TikTok, and more. 
            Our mission is to make it easy for everyone to save and enjoy content offline, anytime.
          </p>
          <ul className="flex gap-4 text-2xl">
            <li className="hover:text-red-500 transition-transform transform hover:scale-125 cursor-pointer">
              <FaYoutube />
            </li>
            <li className="hover:text-pink-500 transition-transform transform hover:scale-125 cursor-pointer">
              <FaInstagram />
            </li>
            <li className="hover:text-blue-500 transition-transform transform hover:scale-125 cursor-pointer">
              <FaFacebook />
            </li>
            <li className="hover:text-sky-400 transition-transform transform hover:scale-125 cursor-pointer">
              <FaTwitter />
            </li>
          </ul>
        </div>

        {/* Image */}
        <div className="md:w-1/2 animate-fadeInRight">
          <img
            src={baner}
            alt="Social Video Downloader"
            className="rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500 cursor-pointer"
          />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="w-full max-w-7xl px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 animate-bounce">
          <h3 className="text-xl font-bold mb-2 text-blue-400">Fast Downloads</h3>
          <p className="text-gray-300">Get your videos and audios instantly without delays.</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 animate-bounce delay-200">
          <h3 className="text-xl font-bold mb-2 text-blue-400">Secure & Private</h3>
          <p className="text-gray-300">Your privacy is our priority. No data is stored.</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 animate-bounce delay-400">
          <h3 className="text-xl font-bold mb-2 text-blue-400">Multiple Platforms</h3>
          <p className="text-gray-300">Download from YouTube, Instagram, Facebook, Twitter & TikTok.</p>
        </div>
      </section>
    </div>
  );
}
