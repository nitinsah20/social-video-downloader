import { FaYoutube, FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import baner from "../assets/baner.webp";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 flex flex-col items-center">
      <section className="w-full max-w-7xl px-6 py-20 flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/2 animate-fadeInLeft">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-400 mb-4">
            About Our Fast and Secure Social Media Video Downloader
          </h1>
          <p className="text-gray-300 mb-6 leading-relaxed text-justify">
            Our online platform is very good for you as it is fast, free, and
            secure for downloading high-quality videos and audio from well-known
            social media sites such as YouTube, Instagram, Facebook, Twitter
            (X), TikTok, Reddit, and Pinterest. We have a user-friendly
            downloader that is compatible with all devices and does not require
            any registration or installation of software. You can use it
            whenever and wherever you want and still have the chance to save
            your favorite reels, stories, and videos quickly in a safe and
            private manner.
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
          <h3 className="text-xl font-bold mb-2 text-blue-400">
            Fast Downloads
          </h3>
          <p className="text-gray-300">
            Download videos and audio files at lightning speed and with no
            waiting time. Our system ensures faster processing to provide you
            with the ultimate user experience, period.
          </p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 animate-bounce delay-200">
          <h3 className="text-xl font-bold mb-2 text-blue-400">
            Secure & Private
          </h3>
          <p className="text-gray-300">
            Your Privacy Is Our Greatest Concern. We don’t save your information
            or any downloads from videos. You can download videos with maximum
            security.
          </p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 animate-bounce delay-400">
          <h3 className="text-xl font-bold mb-2 text-blue-400">
            Multiple Platforms
          </h3>
          <p className="text-gray-300">
            Download videos and audio from YouTube, Instagram, Facebook, Twitter
            (X), TikTok, and other platforms. We support most social platforms
            so that you can download from whichever one you like.
          </p>
        </div>
      </section>
    </div>
  );
}
