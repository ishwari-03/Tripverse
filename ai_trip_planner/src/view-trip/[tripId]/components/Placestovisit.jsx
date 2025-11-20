import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUnsplashImage } from "@/services/GlobalAPI";

const Placestovisit = ({ trip }) => {
  const [placeImages, setPlaceImages] = useState([]);

  useEffect(() => {
    loadImages();
  }, [trip]);

  const loadImages = async () => {
    const allPlaces =
      trip?.tripData?.itinerary?.flatMap(day => day.plan) || [];

    const images = await Promise.all(
      allPlaces.map(place =>
        fetchUnsplashImage(place.place_name)
      )
    );

    setPlaceImages(images);
  };

  let imageIndex = 0;

  return (
    <div className="mt-10">
      <h2 className="font-bold text-3xl mb-4">Places to Visit</h2>

      <div className="flex flex-col gap-10">
        {trip?.tripData?.itinerary?.map((dayPlan, dayIndex) => (
          <div key={dayIndex} className="border p-5 rounded-xl shadow-sm  backdrop-blur-sm">

            <h2 className="text-xl font-bold mb-3 flex items-center justify-center text-center
">Day {dayPlan.day}</h2>

            <div className="grid md:grid-cols-2 gap-5">
              {dayPlan.plan?.map((place, index) => {
                const img = placeImages[imageIndex] || "/placeholder.jpg";
                imageIndex++;

                return (
                  <Link
                    key={index}
                    to={`https://www.google.com/maps/search/?api=1&query=${place.place_name}`}
                    target="_blank"
                  >
                    <div className="p-4 border rounded-lg shadow-sm bg-[#faf7f2] hover:scale-105 transition-all">

                      <img
                        src={img}
                        alt={place.place_name}
                        className="rounded-xl w-full h-[130px] object-cover"
                      />

                      <div className="mt-3">
                        <h3 className="font-semibold text-lg">{place.place_name}</h3>
                        <p className="text-sm text-gray-700 mt-1">{place.details}</p>
                        <p className="text-sm mt-2">⭐ Rating: {place.rating}</p>
                        <p className="text-sm text-yellow-900">🎟 Ticket: {place.ticket_price}</p>
                        
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Placestovisit;
