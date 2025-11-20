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
    <Link to={'/view-trip/'+trip?.id}>
    <div className='hover:scale-105 transition-all '>
      <img 
        src={image} 
        className="object-cover rounded-xl w-full h-[250px]"
      />

      <div>
        <h2 className="font-bold text-lg text-white">
          {trip?.userSelection?.destination}
        </h2>

        <h2 className="text-sm font-semibold text-gray-800">
          {trip?.userSelection?.days} Days trip with {trip?.userSelection?.budget} Budget
        </h2>
      </div>
    </div>
    </Link>
  );
};


export default Usertripcarditem
