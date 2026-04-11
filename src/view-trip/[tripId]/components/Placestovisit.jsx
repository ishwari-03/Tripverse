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
    <div className="mt-16 pb-20">
      <h2 className="font-bold text-4xl text-white mb-8 drop-shadow-xl tracking-tight">🗺️ Your Itinerary</h2>

      <div className="flex flex-col gap-12">
        {trip?.tripData?.itinerary?.map((dayPlan, dayIndex) => (
          <div key={dayIndex} className="relative">
            {/* DAY DIVIDER */}
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-amber-500 text-black font-black px-6 py-2 rounded-2xl text-xl shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                Day {dayPlan.day}
              </div>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-amber-500/50 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {dayPlan.plan?.map((place, index) => {
                const img = placeImages[imageIndex] || "/placeholder.jpg";
                imageIndex++;

                return (
                  <Link
                    key={index}
                    to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.place_name + ", " + (trip?.userSelection?.destination || ""))}`}
                    target="_blank"
                    className="group"
                  >
                    <div className="glass-card hover:translate-y-[-5px] transition-all duration-300 h-full overflow-hidden border-white/5 flex flex-col sm:flex-row gap-5 p-4">
                      <div className="relative w-full sm:w-[150px] shrink-0">
                        <img
                          src={img}
                          alt={place.place_name}
                          className="rounded-2xl w-full h-[180px] sm:h-full object-cover shadow-lg"
                        />
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-yellow-400 text-xs px-2 py-1 rounded-lg font-bold flex items-center gap-1">
                          ⭐ {place.rating}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 py-1">
                        <h3 className="font-bold text-2xl text-white group-hover:text-amber-400 transition-colors uppercase tracking-tight">
                          {place.place_name}
                        </h3>
                        <p className="text-sm text-indigo-100 font-medium leading-relaxed line-clamp-3">
                          {place.details}
                        </p>
                        
                        <div className="mt-auto pt-4 flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/50 text-amber-500 text-xs font-black rounded-full flex items-center gap-1 shadow-lg">
                            🎟️ TICKET: {place.ticket_price}
                          </span>
                          <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 text-xs font-black rounded-full flex items-center gap-1 shadow-lg">
                            ⏰ PLAN: {place.time || "Flexible"}
                          </span>
                        </div>
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
