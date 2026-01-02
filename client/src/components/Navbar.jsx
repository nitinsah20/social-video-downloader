import React, { useState } from "react";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-cyan-50 shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0">
           <link rel="stylesheet" href="" /> <img src={Logo} alt="logo" className="w-16 h-16 animate-pulse" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            <Link
              to="/"
              className="hover:bg-slate-900 px-3 py-2 rounded-md hover:scale-105 transition-transform duration-500 cursor-pointer"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="hover:bg-slate-900 px-3 py-2 rounded-md hover:scale-105 transition-transform duration-500 cursor-pointer"
            >
              About
            </Link>
            <Link
              to="/youtube"
              className="hover:bg-slate-900 px-3 py-2 rounded-md hover:scale-105 transition-transform duration-500 cursor-pointer"
            >
              YouTube
            </Link>
            <Link
              to="/instagram"
              className="hover:bg-slate-900 px-3 py-2 rounded-md hover:scale-105 transition-transform duration-500 cursor-pointer"
            >
              Instagram
            </Link>
            <Link
              to="/twitter"
              className="hover:bg-slate-900 px-3 py-2 rounded-md hover:scale-105 transition-transform duration-500 cursor-pointer"
            >
              Twitter
            </Link>
            <Link
              to="/facebook"
              className="hover:bg-slate-900 px-3 py-2 rounded-md hover:scale-105 transition-transform duration-500 cursor-pointer"
            >
              Facebook
            </Link>
            <Link
              to="/tiktok"
              className="hover:bg-slate-900 px-3 py-2 rounded-md hover:scale-105 transition-transform duration-500 cursor-pointer"
            >
              TikTok
            </Link>

            <Link
              to="/reddit"
              className="hover:bg-slate-900 px-3 py-2 rounded-md hover:scale-105 transition-transform duration-500 cursor-pointer"
            >
              Reddit
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-cyan-50 focus:outline-none"
            >
              {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-4 space-y-1 bg-black animate-fadeIn">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md hover:bg-red-600 transition hover:animate-bounce"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block px-3 py-2 rounded-md hover:bg-red-600 transition hover:animate-bounce"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            to="/youtube"
            className="block px-3 py-2 rounded-md hover:bg-red-600 transition hover:animate-bounce"
            onClick={() => setIsOpen(false)}
          >
            YouTube
          </Link>
          <Link
            to="/instagram"
            className="block px-3 py-2 rounded-md hover:bg-red-600 transition hover:animate-bounce"
            onClick={() => setIsOpen(false)}
          >
            Instagram
          </Link>
          <Link
            to="/twitter"
            className="block px-3 py-2 rounded-md hover:bg-red-600 transition hover:animate-bounce"
            onClick={() => setIsOpen(false)}
          >
            Twitter
          </Link>
          <Link
            to="/facebook"
            className="block px-3 py-2 rounded-md hover:bg-red-600 transition hover:animate-bounce"
            onClick={() => setIsOpen(false)}
          >
            Facebook
          </Link>
          <Link
            to="/tiktok"
            className="block px-3 py-2 rounded-md hover:bg-red-600 transition hover:animate-bounce"
            onClick={() => setIsOpen(false)}
          >
            TikTok
          </Link>
        </div>
      )}
    </nav>
  );
}
