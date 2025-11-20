import { db } from '@/services/firebaseconfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Usertripcarditem from './components/Usertripcarditem';

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


  return (
    <div
      className="
        relative min-h-screen w-full 
        bg-cover bg-center bg-no-repeat bg-fixed backdrop-blur-2xl
      "
      style={{ backgroundImage: "url('/mytrips.jpg')" }}
    >

      {/* DARK + BLUR OVERLAY */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>

      {/* CONTENT */}
      <div className="relative z-10 
                      sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 
                      pt-24 pb-10 gap-5">

        <h2 className='font-bold text-3xl text-white drop-shadow-xl flex justify-center'>
          My Trips
        </h2>

        <div className='grid grid-cols-2 md:grid-cols-3 mt-5 gap-3'>
  {userTrips?.length > 0
    ? userTrips.map((trip, index) => (

        <div
          key={trip.id}
          className="
            p-4 rounded-2xl 
            bg-white/20 backdrop-blur-md 
            border border-white/30 shadow-xl 
            hover:bg-white/30 hover:scale-[1.03]
            transition-all
          "
        >
          <Usertripcarditem trip={trip} />
        </div>

      ))
    : [1,2,3,4,5,6].map((item, index) => (
        <div
          key={index}
          className='h-[250px] w-full bg-white/30 backdrop-blur-md animate-pulse rounded-xl'
        ></div>
      ))}
</div>


      </div>
    </div>
  );
}

export default Mytrips;
