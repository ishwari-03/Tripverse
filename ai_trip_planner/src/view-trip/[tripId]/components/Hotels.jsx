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
    <div className='font-bold text-xl mt-10'>
      
      <h2 className='font-bold text-3xl mt-10'>Hotel Recommendations</h2>

      <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-5'>
        {trip?.tripData?.hotels?.map((hotel, index) => (
          <Link
            key={index}
            to={`https://www.google.com/maps/search/?api=1&query=${hotel.hotel_name},${hotel.address}`}
            target='_blank'
          >
            <div className='hover:scale-110 transition-all cursor-pointer'>
              
              <img
                src={hotelImages[index] || "/placeholder.jpg"}
                className='rounded-xl w-full h-[180px] object-cover'
              />
              
              <div className='my-2 flex flex-col gap-2'>
                <h2 className='font-medium'>📍{hotel.hotel_name}</h2>
                <h2 className='text-sm text-gray-700'>{hotel.address}</h2>
                <h2 className='text-lg text-gray-1000'> {hotel.price}</h2>
                <h2 className='text-sm text-gray-900'>⭐ {hotel.rating}</h2>
              </div>

            </div>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default Hotels;
