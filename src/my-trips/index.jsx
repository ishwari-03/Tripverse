import { db } from '@/services/firebaseconfig';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Usertripcarditem from './components/Usertripcarditem';
import { toast } from 'sonner';

const Mytrips = () => {

  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/");
      return;
    }

    const q = query(
      collection(db, "AITrips"),
      where("userEmail", "==", user?.email)
    );

    const querySnapshot = await getDocs(q);

    const trips = [];
    querySnapshot.forEach((doc) => {
      trips.push({ id: doc.id, ...doc.data() });
    });

    setUserTrips(trips);
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      await deleteDoc(doc(db, "AITrips", tripId));
      setUserTrips(prev => prev.filter(trip => trip.id !== tripId));
      toast.success("Trip deleted successfully");
    } catch (err) {
      console.log(err);
      toast.error("Error deleting trip");
    }
  };

  return (
    <div
      className="
        relative min-h-screen w-full 
        bg-cover bg-center bg-no-repeat bg-fixed
      "
      style={{ backgroundImage: "url('/mytrips.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-24">
        <div className="flex flex-col gap-2 mb-12 animate-in fade-in slide-in-from-top-5 duration-700">
          <h2 className='font-bold text-5xl text-white tracking-tight drop-shadow-2xl'>
            My Trips
          </h2>
          <p className="text-indigo-200/60 text-lg">Your personal collection of adventures.</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
          {userTrips?.length > 0
            ? userTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="animate-in fade-in zoom-in duration-500"
                >
                  <Usertripcarditem trip={trip} onDelete={() => handleDeleteTrip(trip.id)} />
                </div>
              ))
            : Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className='h-[350px] w-full glass-card animate-pulse rounded-[2rem]'
                ></div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default Mytrips;
