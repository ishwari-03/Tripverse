import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div 
      className="
        relative w-full min-h-screen 
        flex items-center justify-center 
        text-center px-6 md:px-20
        overflow-hidden
      "
    >
      {/* Background Image with optimized overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: "url('/hero_premium.png')" }}
      ></div>
      
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/60 via-transparent to-indigo-950/80"></div>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        
        <div className="inline-block mx-auto px-4 py-1.5 mb-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-sm font-semibold tracking-wider uppercase">
          ✨ The Future of Travel Planning
        </div>

        <h1 className="font-extrabold text-[44px] md:text-[72px] leading-[1.1] drop-shadow-2xl">
          <span className="text-white">
            Explore the World with 
          </span>
          <br />
          <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent text-glow">
            AI-Powered Precision
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-indigo-100/90 font-medium drop-shadow-lg leading-relaxed">
          Your personal AI travel concierge. Crafted itineraries, hidden gems, and 
          perfectly timed journeys tailored to your unique style.
        </p>

        {/* Action Area */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/create-trip">
            <button className="btn-premium flex items-center gap-2 group">
              Start Your Journey
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Link>
          
          <button className="px-8 py-3 rounded-xl font-semibold glass border-white/20 hover:bg-white/10 transition-all text-white">
            How it works
          </button>
        </div>

        {/* Stats / Proof points */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-white/10">
          <div>
            <h3 className="text-2xl font-bold text-white">10k+</h3>
            <p className="text-indigo-200/60 text-sm">Trips Planned</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">4.9/5</h3>
            <p className="text-indigo-200/60 text-sm">User Rating</p>
          </div>
          <div className="hidden md:block">
            <h3 className="text-2xl font-bold text-white">100%</h3>
            <p className="text-indigo-200/60 text-sm">Personalized</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
