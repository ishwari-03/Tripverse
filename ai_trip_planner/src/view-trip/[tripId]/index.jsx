import { db } from '@/services/firebaseconfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Infosection from './components/Infosection';
import Hotels from './components/Hotels';
import Placestovisit from './components/Placestovisit';
import Footer from './components/Footer';

const ViewTrip = () => {

  const { tripId } = useParams();
  const [trip, setTrip] = useState([]);

  useEffect(() => {
    tripId && GetTripData();
  }, [tripId]);

  const GetTripData = async () => {
    const docRef = doc(db, 'AITrips', tripId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document:", docSnap.data());
      setTrip(docSnap.data());
    } else {
      console.log("No such Document");
    }
  };

  return (
    <div
      className="
        relative 
        min-h-screen w-full 
        bg-cover bg-center bg-no-repeat bg-fixed
        flex justify-center
      "
      style={{ backgroundImage: "url('/trip.jpg')" }}
    >

      {/* overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>

      {/* Main glass container */}
      <div
        className="
          relative z-10 
          w-full 
          p-10 md:px-20 lg:px-44 xl:px-56 
          rounded-xl 
          bg-white/10 backdrop-blur-xs 
          border border-white/30 
          shadow-xl mt-20 mb-10
        "
      >
        <Infosection trip={trip} />
        <Hotels trip={trip} />
        <Placestovisit trip={trip} />
        <Footer trip={trip} />
      </div>
    </div>
  );
};

export default ViewTrip;
