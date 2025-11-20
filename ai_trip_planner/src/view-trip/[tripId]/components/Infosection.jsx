import { Button } from "@/components/ui/button";
import { fetchUnsplashImage } from "@/services/GlobalAPI";
import React, { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";

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
    <div>
      {/* Header image */}
      <img
        src={image}
        className="h-[340px] w-full rounded-xl object-cover"
        alt="Destination"
      />

      <div className="flex justify-between items-center">
        <div className="my-5 flex flex-col gap-2">
          <h2 className="font-bold text-3xl">
            {trip?.userSelection?.destination || "Destination not found"}
          </h2>

          <div className="flex gap-8">
            <h2 className="p-1 px-3 bg-amber-100 rounded-full text-gray-800">
              📅 {trip.userSelection?.days} Days
            </h2>

            <h2 className="p-1 px-3 bg-amber-50 rounded-full text-gray-800">
              💸 {trip.userSelection?.budget} Budget
            </h2>

            <h2 className="p-1 px-3 bg-amber-100 rounded-full text-gray-800">
              🥂 Travelers: {trip.userSelection?.travelers}
            </h2>
          </div>
        </div>

        <Button>
          <IoIosSend />
        </Button>
      </div>
    </div>
  );
};

export default Infosection;
