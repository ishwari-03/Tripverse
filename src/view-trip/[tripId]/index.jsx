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
      style={{ backgroundImage: "url('/36.jpg')" }}
    >

      {/* Deep contrast overlay */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm"></div>

      {/* Main glass container */}
      <div
        className="
          relative z-10 
          w-full 
          p-6 sm:p-10 md:px-20 lg:px-44 xl:px-56 
          rounded-[2.5rem]
          bg-indigo-950/40 backdrop-blur-xl 
          border border-white/10 
          shadow-2xl mt-24 mb-12
          animate-in fade-in zoom-in duration-700
        "
      >
        <div className="flex flex-col gap-12">
          <Infosection trip={trip} />
          <Hotels trip={trip} />
          <Placestovisit trip={trip} />
          <Footer trip={trip} />
        </div>
      </div>
    </div>
  );
};

export default ViewTrip;
