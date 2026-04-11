import { Button } from "@/components/ui/button";
import { fetchUnsplashImage } from "@/services/GlobalAPI";
import React, { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { toast } from "sonner";

const Infosection = ({ trip }) => {
  const [image, setImage] = useState("/placeholder.jpg");

  useEffect(() => {
    if (trip?.userSelection?.destination) {
      loadDestinationImage();
    }
  }, [trip]);

  const loadDestinationImage = async () => {
    try {
      const query = trip.userSelection.destination;
      const unsplashImage = await fetchUnsplashImage(query);

      setImage(unsplashImage);
      console.log("Unsplash Loaded:", unsplashImage);
    } catch (err) {
      console.log("Header Photo Error:", err);
      setImage("/placeholder.jpg");
    }
  };

  return (
    <div className="mt-6">
      {/* Header image with subtle overlay */}
      <div className="relative group overflow-hidden rounded-[2rem]">
        <img
          src={image}
          className="h-[400px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt="Destination"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <div className="flex justify-between items-end -mt-20 relative z-20 px-8">
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-5xl text-white drop-shadow-2xl tracking-tight">
            {trip?.userSelection?.destination || "Destination not found"}
          </h2>

          <div className="flex flex-wrap gap-3">
            <h2 className="p-2 px-5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-amber-500 text-sm font-bold flex items-center gap-2">
              📅 {trip.userSelection?.days} Days
            </h2>

            <h2 className="p-2 px-5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-amber-500 text-sm font-bold flex items-center gap-2">
              💸 {trip.userSelection?.budget} Budget
            </h2>

            <h2 className="p-2 px-5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-amber-500 text-sm font-bold flex items-center gap-2">
              🥂 {trip.userSelection?.travelers} Travelers
            </h2>
          </div>
        </div>

        <button 
          className="btn-premium p-4 rounded-2xl flex items-center justify-center transition-all hover:rotate-12 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Trip link copied!");
          }}
        >
          <IoIosSend className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default Infosection;
