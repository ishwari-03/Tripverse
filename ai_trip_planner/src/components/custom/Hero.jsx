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
        bg-cover bg-center bg-no-repeat
      "
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      {/* Dark → Light Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl flex flex-col gap-8">
        <h1 className="font-extrabold text-[40px] md:text-[60px] leading-tight drop-shadow-xl">
          <span className="text-white">
            Explore the World with Confidence :
          </span>
          <br />
          <span className="text-white">AI Designs Your Ideal Journey</span>
        </h1>

        <p className="text-lg md:text-xl text-white/90 font-medium drop-shadow-lg">
          Plan perfect holidays in seconds — from choosing destinations to 
          finding hotels, experiences, and daily itineraries. Powered by AI,
          your trips become smarter, easier, and fully personalized to your style and budget.
        </p>

        {/* Glassmorphism Button */}
        <Link to="/create-trip" className="mx-auto">
          <Button
            className="
              px-10 py-5 text-lg font-semibold 
              backdrop-blur-xl bg-white/30 text-black 
              border border-white/40 shadow-lg 
              hover:bg-white/50 hover:scale-105 
              transition-all rounded-xl
            "
          >
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
