import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchUnsplashImage } from "@/services/GlobalAPI";

const Hotels = ({ trip }) => {
  const [hotelImages, setHotelImages] = useState([]);

  useEffect(() => {
    loadHotelImages();
  }, [trip]);

  const loadHotelImages = async () => {
    if (!trip?.tripData?.hotels) return;

    const images = await Promise.all(
      trip.tripData.hotels.map(hotel =>
        fetchUnsplashImage(hotel.hotel_name + " hotel")
      )
    );

    setHotelImages(images);
  };

  return (
    <div className='mt-16'>
      <h2 className='font-bold text-3xl text-white drop-shadow-lg'>🏨 Recommended Hotels</h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8'>
        {trip?.tripData?.hotels?.map((hotel, index) => (
          <Link
            key={index}
            to={`https://www.google.com/maps/search/?api=1&query=${hotel.hotel_name},${hotel.address}`}
            target='_blank'
            className='h-full'
          >
            <div className='glass-card flex flex-col h-full hover:scale-105 transition-all duration-300'>
              <img
                src={hotelImages[index] || "/placeholder.jpg"}
                className='rounded-t-2xl w-full h-[200px] object-cover'
                alt={hotel.hotel_name}
              />
              
              <div className='p-5 flex flex-col flex-1 gap-3'>
                <h2 className='font-bold text-xl text-white tracking-tight leading-tight'>{hotel.hotel_name}</h2>
                <div className='flex flex-col gap-1'>
                  <h2 className='text-[10px] text-amber-500 uppercase tracking-[0.2em] font-black opacity-80'>
                     📍 ADDRESS
                  </h2>
                  <h2 className='text-sm text-indigo-100 font-medium line-clamp-2'>{hotel.address}</h2>
                </div>
                
                <div className='mt-auto pt-4 flex justify-between items-center border-t border-white/10'>
                   <h2 className='text-xl font-black text-amber-500 tracking-tighter'> {hotel.price}</h2>
                   <div className='px-3 py-1 bg-black/40 rounded-full text-xs text-yellow-500 font-bold border border-white/10 flex items-center gap-1 shadow-inner'>
                     ⭐ {hotel.rating}
                   </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Hotels;
