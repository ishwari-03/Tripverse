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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

const Header = () => {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [openDialog, setOpenDialog] = useState(false);

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
      className="
        w-full px-6 py-4 flex justify-between items-center
        fixed top-0 left-0 z-50
      "
    >

      {/* Logo (NO glow, NO blur, NO background) */}
      <img 
        src='/logoipsum-405.svg' 
        className="h-12"
      />

      {/* Buttons */}
      <div>
        {user ? (
          <div className='flex items-center gap-4'>

            <a href='/my-trips'>
              <Button 
                variant='ghost'
                className="
                  rounded-full px-5 py-2 text-white
                  bg-black/40 border border-white/30
                  hover:bg-black/60 hover:scale-[1.05]
                  transition-all duration-300
                "
              >
                My Trips
              </Button>
            </a>

            <a href='/create-trip'>
              <Button 
                variant='ghost'
                className="
                  rounded-full px-5 py-2 text-white
                  bg-black/40 border border-white/30
                  hover:bg-black/60 hover:scale-[1.05]
                  transition-all duration-300
                "
              >
                Add Trip
              </Button>
            </a>

            <Popover>
              <PopoverTrigger>
                <img 
                  src={user?.picture} 
                  className="
                    h-[38px] w-[38px] rounded-full 
                    border border-white/50 shadow-md 
                    hover:scale-110 transition-all duration-300
                  "
                />
              </PopoverTrigger>

              <PopoverContent
                className="
                  bg-white text-black border shadow-xl
                  rounded-xl p-4
                "
              >
                <h2 
                  className='cursor-pointer font-medium'
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
          <Button
            onClick={() => setOpenDialog(true)}
            className="
              rounded-full px-6 py-2 text-black
              bg-white hover:bg-gray-200 hover:scale-[1.05]
              shadow-lg transition-all duration-300
            "
          >
            Sign In
          </Button>
        )}
      </div>

      {/* GLOBAL SIGN-IN POPUP */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog} modal>
        <DialogContent className="p-0 overflow-hidden rounded-2xl">

          <div
            className="relative w-full h-full p-8 flex flex-col items-center justify-center"
            style={{
              backgroundImage: "url('/login.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >

            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

            <div className="relative z-10 text-center">

              <img src="/logoipsum-405.svg" className="h-14 mb-4 drop-shadow-lg content-center" />

              <h2 className="font-bold text-3xl text-black">
                Welcome Back!
              </h2>

              <p className="text-sm mb-5 text-gray-800">
                Sign in to continue your journey
              </p>

              <Button
                onClick={login}
                className="
                  w-full py-3 flex gap-3 items-center justify-center 
                  bg-white/30 hover:bg-white/50 backdrop-blur-xl
                  border border-white/40 text-black font-semibold 
                  rounded-xl shadow-lg transition-all
                "
              >
                <FcGoogle className="h-6 w-6 bg-white rounded-full p-1" />
                Sign In with Google
              </Button>

            </div>

          </div>

        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Header;
