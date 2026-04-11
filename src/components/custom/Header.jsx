import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { Link } from 'react-router-dom';

const Header = () => {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [openDialog, setOpenDialog] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const login = useGoogleLogin({
    onSuccess: (tokenInfo) => GetUserProfile(tokenInfo),
    onError: (err) => console.log("Google Login Error:", err),
  });

  const GetUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: { Authorization: `Bearer ${tokenInfo.access_token}` },
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
      setOpenDialog(false);
      window.location.reload();

    } catch (err) {
      console.log("Google Profile Error:", err);
    }
  };

  return (
    <div
      className={`
        w-full px-6 py-4 flex justify-between items-center
        fixed top-0 left-0 z-50 transition-all duration-300
        ${scrolled ? 'glass py-3 border-b border-white/10' : 'bg-transparent'}
      `}
    >

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img 
          src='/logo.png' 
          className="h-16 transition-transform hover:scale-110 object-contain"
          alt="Tripverse Logo"
        />
        <span className="text-white font-bold text-2xl tracking-tight hidden sm:block">
          Trip<span className="text-amber-500">verse</span>
        </span>
      </Link>

      {/* Buttons */}
      <div className='flex items-center gap-4'>
        {user ? (
          <div className='flex items-center gap-3 md:gap-4'>

            <Link to='/my-trips'>
              <Button 
                variant='ghost'
                className="
                  rounded-xl px-4 py-2 text-white
                  hover:bg-white/10 transition-all duration-300
                "
              >
                My Trips
              </Button>
            </Link>

            <Link to='/create-trip'>
              <button 
                className="
                  hidden md:block btn-premium text-sm py-2 px-6
                "
              >
                + Plan a Trip
              </button>
            </Link>

            <Popover>
              <PopoverTrigger>
                <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500">
                  <img 
                    src={user?.picture} 
                    className="
                      h-[34px] w-[34px] rounded-full 
                      border-2 border-indigo-950
                      hover:scale-110 transition-all duration-300
                    "
                  />
                </div>
              </PopoverTrigger>

              <PopoverContent
                className="
                  glass text-white border-white/10 shadow-2xl
                  rounded-2xl p-2 mt-2 w-48
                "
              >
                <h2 
                  className='cursor-pointer font-medium p-3 hover:bg-white/10 rounded-xl transition-all text-center text-red-400'
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  Logout
                </h2>
              </PopoverContent>
            </Popover>

          </div>
        ) : (
          <button
            onClick={() => setOpenDialog(true)}
            className="
              btn-premium text-sm
            "
          >
            Get Started
          </button>
        )}
      </div>

      {/* GLOBAL SIGN-IN POPUP */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="p-0 overflow-hidden border-white/10 bg-indigo-950 !max-w-[850px] w-[95vw] rounded-[2.5rem] shadow-[0_0_60px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col md:flex-row h-full min-h-[520px]">
            {/* Horizontal Image Anchor */}
            <div 
              className="hidden md:block w-[40%] bg-cover bg-center relative"
              style={{ backgroundImage: "url('/login_premium.png')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/40 via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-indigo-950/10 backdrop-blur-[0.5px]"></div>
            </div>

            {/* Expansive Content Area */}
            <div className="w-full md:w-[60%] p-10 md:p-14 flex flex-col items-center justify-center">
              <div className="mb-8">
                <img src="/logo.png" className="h-16 mx-auto drop-shadow-lg object-contain" alt="Tripverse Logo" />
              </div>

              <div className="text-center space-y-4 mb-10 w-full">
                <h2 className="font-extrabold text-4xl md:text-5xl text-white tracking-tight leading-[1.1] drop-shadow-2xl">
                  Explore Your Next <br/> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Adventure</span>
                </h2>

                <p className="text-indigo-100/60 text-base max-w-sm mx-auto leading-relaxed">
                  Securely access your personalized, AI-crafted travel itineraries from any device.
                </p>
              </div>

              <div className="w-full max-w-md px-4">
                <button
                  onClick={login}
                  className="
                    w-full py-5 flex gap-4 items-center justify-center 
                    bg-white text-slate-950 font-black text-lg
                    rounded-2xl shadow-2xl 
                    hover:bg-indigo-50 hover:-translate-y-1
                    active:translate-y-0 active:scale-[0.98] transition-all duration-300
                  "
                >
                  <FcGoogle className="h-7 w-7" />
                  Continue with Google
                </button>
              </div>
              
              <div className="mt-10 pt-6 border-t border-white/5 w-full max-w-xs">
                <p className="text-[10px] text-center text-indigo-100/30 font-bold uppercase tracking-[0.25em]">
                  Tripverse &copy; 2026
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Header;
