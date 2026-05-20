import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  selectbudgetoptions,
  SelectTravelesList,
  AI_PROMPT,
} from "@/constants/options";
import { Button } from "@/components/ui/button";
import { callGemini } from "@/services/aimodal";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MOCK_TRIP_DATA } from "@/services/mockData";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/services/firebaseconfig";
import { useNavigate } from "react-router-dom";

const CreateTrip = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [days, setDays] = useState("");
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  const API_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

  const timeoutRef = useRef(null);

  const handleInputChange = (value) => {
    setQuery(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (value.length < 2) {
      setResults([]);
      return;
    }
    
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${value}&apiKey=${API_KEY}`);
        const data = await res.json();
        setResults(data.features || []);
      } catch (err) {
        console.error("Geocoding API error:", err);
      }
    }, 400);
  };

  const choosePlace = (place) => {
    setQuery(place.properties.formatted);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setResults([]);
  };

  const login = useGoogleLogin({
    onSuccess: (tokenInfo) => GetUserProfile(tokenInfo),
    onError: (err) => console.log("Google Login Error:", err),
  });

  const GetUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        { headers: { Authorization: `Bearer ${tokenInfo.access_token}` } }
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
      setOpenDialog(false);
      generateTrip();
    } catch (err) {
      console.log("Google Profile Error:", err);
    }
  };

  const generateTrip = async () => {
    if (!query || !days || !selectedBudget || !selectedTraveler) {
      alert("Please fill all fields before generating your trip.");
      return;
    }
    try {
      setLoading(true);
      setErrorMsg("");

      const finalPrompt = AI_PROMPT
        .replace("{location}", query)
        .replace("{days}", days)
        .replace("{travelers}", selectedTraveler)
        .replace("{budget}", selectedBudget);

      let aiResponseText;
      try {
        aiResponseText = await callGemini(finalPrompt);
      } catch (err) {
        console.warn("🧭 AI Generation failed. Switching to 'Concept Demo' Mode...");
        const mockData = MOCK_TRIP_DATA(query, days, selectedTraveler, selectedBudget);
        aiResponseText = JSON.stringify(mockData);
        toast("Note: Using Demo Trip Data due to API restrictions.");
      }

      const docId = await saveTrip(aiResponseText);
      setLoading(false);
      if (docId) navigate(`/view-trip/${docId}`);
    } catch (err) {
      console.log("❌ AI Error:", err);
      setErrorMsg("AI generation interrupted. Please check your API key or try again later.");
      setLoading(false);
    }
  };

  const saveTrip = async (TripData) => {
    if (!TripData) return null;
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const docId = Date.now().toString();
      const cleanJSON = TripData.replace(/```json/i, "").replace(/```/g, "").trim();
      let parsedAI = {};
      try {
        parsedAI = JSON.parse(cleanJSON);
      } catch {
        parsedAI = { raw: TripData };
      }
      const formData = { destination: query, days, budget: selectedBudget, travelers: selectedTraveler };
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: parsedAI,
        userEmail: userData?.email,
        id: docId,
      });
      return docId;
    } catch (err) {
      console.log("❌ Firestore Save Error:", err);
      return null;
    }
  };

  const handleGenerate = () => {
    if (!user) {
      setOpenDialog(true);
      return;
    }
    generateTrip();
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0c] overflow-hidden pt-24 pb-20">
      {/* Immersive Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
        style={{ backgroundImage: "url('/hero_premium.png')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/80 via-transparent to-indigo-950/90 pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="glass p-8 md:p-12 rounded-[2.5rem] border-white/10 shadow-2xl">
          
          <div className="mb-12">
            <h2 className="font-bold text-4xl text-white mb-3">
              Design Your <span className="text-amber-500">Dream Trip</span>
            </h2>
            <p className="text-indigo-200/70 text-lg">
              Provide a few details and let our AI craft your personalized itinerary.
            </p>
          </div>

          <div className="space-y-12">
            {/* DESTINATION */}
            <div className="animate-in fade-in slide-in-from-left-5 duration-500">
              <label className="text-xl font-semibold text-white block mb-4">
                1. Where do you want to go?
              </label>
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="e.g. Kyoto, Japan"
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:bg-white/10 transition-all outline-none"
                />
                {results.length > 0 && (
                  <ul className="absolute bg-indigo-950/95 backdrop-blur-2xl border border-white/20 w-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-64 overflow-auto mt-2 z-[100] overflow-hidden">
                    {results.map((place, i) => (
                      <li
                        key={i}
                        onClick={() => choosePlace(place)}
                        className="p-4 hover:bg-white/10 cursor-pointer text-indigo-100 transition-colors border-b border-indigo-900 last:border-0"
                      >
                        {place.properties.formatted}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* DAYS */}
            <div className="animate-in fade-in slide-in-from-left-5 duration-500 delay-100">
              <label className="text-xl font-semibold text-white block mb-4">
                2. Duration (Days)
              </label>
              <Input
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="Number of days"
                className="w-full p-4 h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:border-amber-500/50"
              />
            </div>            {/* BUDGET */}
            <div className="animate-in fade-in slide-in-from-left-5 duration-500 delay-200">
              <label className="text-xl font-semibold text-white block mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 text-sm">3</span>
                What is your budget level?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectbudgetoptions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedBudget(item.title)}
                    className={`
                      p-8 rounded-[2rem] flex flex-col items-start text-left cursor-pointer 
                      transition-all duration-500 border backdrop-blur-md
                      ${selectedBudget === item.title ? 
                        'bg-amber-500/20 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.25)]' : 
                        'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1'}
                    `}
                  >
                    <h3 className="font-bold text-white text-2xl tracking-tight">{item.title}</h3>
                    <p className="text-indigo-200/50 text-sm mt-3 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* TRAVELERS */}
            <div className="animate-in fade-in slide-in-from-left-5 duration-500 delay-300">
              <label className="text-xl font-semibold text-white block mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 text-sm">4</span>
                Who are you exploring with?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SelectTravelesList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedTraveler(item.title)}
                    className={`
                      p-8 rounded-[2rem] flex flex-col items-start text-left cursor-pointer 
                      transition-all duration-500 border backdrop-blur-md
                      ${selectedTraveler === item.title ? 
                        'bg-amber-500/20 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.25)]' : 
                        'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1'}
                    `}
                  >
                    <h3 className="font-bold text-white text-2xl tracking-tight">{item.title}</h3>
                    <p className="text-indigo-200/50 text-sm mt-3 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-20 flex flex-col items-center gap-8">
            <button
              disabled={loading}
              onClick={handleGenerate}
              className="btn-premium w-full md:w-auto px-24 py-6 text-xl flex items-center justify-center gap-4 group"
            >
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin text-white" />
                  <span className="animate-pulse">Crafting Your Journey...</span>
                </>
              ) : (
                <>
                  Generate My Trip
                  <span className="group-hover:translate-x-1 transition-transform">✨</span>
                </>
              )}
            </button>
            
            {errorMsg && (
              <div className="mt-4 bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-2xl animate-in fade-in zoom-in duration-300">
                ⚠️ {errorMsg}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="p-0 overflow-hidden rounded-3xl border-white/20 bg-indigo-950">
          <div className="p-10 flex flex-col items-center text-center">
            <img src="/logo.png" className="h-20 mb-6 drop-shadow-2xl" alt="Tripverse Logo" />
            <h2 className="text-2xl font-bold text-white mb-2">Sign in Required</h2>
            <p className="text-indigo-200/60 mb-8">Please sign in with Google to generate and save your trips.</p>
            <button
               onClick={login}
               className="w-full py-4 flex gap-3 items-center justify-center bg-white text-black font-bold rounded-2xl"
            >
              <FcGoogle className="h-6 w-6" />
              Continue with Google
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTrip;
