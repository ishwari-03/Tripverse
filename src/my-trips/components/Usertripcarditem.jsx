import React from 'react'
import { fetchUnsplashImage } from "@/services/GlobalAPI";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const Usertripcarditem = ({ trip }) => {
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
    <Link to={'/view-trip/' + trip?.id}>
      <div className='glass-card group hover:scale-[1.03] transition-all duration-300 h-full flex flex-col overflow-hidden border-white/5'>
        <div className="relative overflow-hidden">
          <img
            src={image}
            className="object-cover w-full h-[220px] transition-transform duration-700 group-hover:scale-110"
            alt={trip?.userSelection?.destination}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
             <span className="text-white text-xs font-bold uppercase tracking-widest">View Details →</span>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-2">
          <h2 className="font-extrabold text-2xl text-white tracking-tight group-hover:text-amber-400 transition-colors drop-shadow-lg">
            {trip?.userSelection?.destination}
          </h2>

          <div className="flex flex-col gap-1">
            <h2 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] opacity-90">
               TRIP SUMMARY
            </h2>
            <h2 className="text-sm font-bold text-white drop-shadow-md">
              {trip?.userSelection?.days} Days • {trip?.userSelection?.budget} Budget
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
};


export default Usertripcarditem
