import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  selectbudgetoptions,
  SelectTravelesList,
  AI_PROMPT,
} from "@/constants/options";
import { Button } from "@/components/ui/button";
import { callGemini } from "@/services/aimodal";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/services/firebaseconfig";
import { useNavigate } from "react-router-dom";

const CreateTrip = () => {
  // ---------------- STATE ----------------
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const [days, setDays] = useState("");
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedTraveler, setSelectedTraveler] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const API_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

  // ---------------- AUTOCOMPLETE ----------------
  const fetchPlaces = async (value) => {
    setQuery(value);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${value}&apiKey=${API_KEY}`
    );

    const data = await res.json();
    setResults(data.features || []);
  };

  const choosePlace = (place) => {
    const formatted = place.properties.formatted;
    setQuery(formatted);
    setResults([]);
  };

  // ---------------- GOOGLE LOGIN --------------------
  const login = useGoogleLogin({
    onSuccess: (tokenInfo) => GetUserProfile(tokenInfo),
    onError: (err) => console.log("Google Login Error:", err),
  });

  const GetUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: { Authorization: `Bearer ${tokenInfo.access_token}` },
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
      setOpenDialog(false);

      generateTrip();
    } catch (err) {
      console.log("Google Profile Error:", err);
    }
  };

  // ---------------- GEMINI + SAVE + NAVIGATION ----------------
 const generateTrip = async () => {
  if (!query || !days || !selectedBudget || !selectedTraveler) {
    alert("Please fill all fields before generating your trip.");
    return;
  }

  try {
    setLoading(true);
    setErrorMsg(""); // ✅ clear previous message

    const finalPrompt = AI_PROMPT
      .replace("{location}", query)
      .replace("{days}", days)
      .replace("{travelers}", selectedTraveler)
      .replace("{budget}", selectedBudget);

    const aiResponse = await callGemini(finalPrompt);

    const docId = await saveTrip(aiResponse);
    setLoading(false);

    if (docId) navigate(`/view-trip/${docId}`);
  } catch (err) {
    console.log("❌ AI Error:", err);

    // ✅ ADD THIS MESSAGE (THIS IS THE KEY PART)
    setErrorMsg(
      "AI generation is temporarily unavailable due to API limits. Please try again later."
    );

    setLoading(false);
  }
};


  // ---------------- SAVE TRIP ----------------
  const saveTrip = async (TripData) => {
    
    if (!TripData) {
    console.warn("Skipping Firestore save — no trip data");
    return null;
  }

  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();

    const cleanJSON = TripData.replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();

      let parsedAI = {};
      try {
        parsedAI = JSON.parse(cleanJSON);
      } catch {
        parsedAI = { raw: TripData };
      }

      const formData = {
        destination: query,
        days,
        budget: selectedBudget,
        travelers: selectedTraveler,
      };

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

  // ---------------- BUTTON ----------------
  const handleGenerate = () => {
    if (!user) {
      setOpenDialog(true);
      return;
    }
    generateTrip();
  };

  // ---------------- UI ----------------
  return (
    <div
      className="
        relative 
        min-h-screen w-full 
        bg-cover bg-center bg-no-repeat bg-fixed
      "
      style={{ backgroundImage: "url('/create.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

      {/* Content Container */}
      <div className="relative z-10 sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 py-20">

        {/* Frosted Glass Card */}
        <div className="bg-white/5 backdrop-blur-lg p-10 rounded-2xl shadow-xl border border-white/30">

          <h2 className="font-bold text-3xl text-gray-900 drop-shadow-md">
            Tell us your Travel Preferences
          </h2>

          <p className="mt-3 text-gray-200">
            Let AI craft your perfect adventure — just share a few details.
          </p>

          {/* DESTINATION */}
          <div className="mt-10">
            <h2 className="text-xl my-3 font-medium text-gray-300">
              What is the Destination of choice?
            </h2>

            <div className="relative">
              <input
                value={query}
                onChange={(e) => fetchPlaces(e.target.value)}
                placeholder="Search destination..."
                className="w-full p-3 rounded-xl shadow-sm bg-white/80 backdrop-blur-md"
              />

              {results.length > 0 && (
                <ul className="absolute bg-white border w-full rounded-xl shadow-md max-h-60 overflow-auto mt-1 z-50">
                  {results.map((place, i) => (
                    <li
                      key={i}
                      onClick={() => choosePlace(place)}
                      className="p-3 hover:bg-[#E9DAC4] cursor-pointer"
                    >
                      {place.properties.formatted}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* DAYS */}
          <div className="mt-10">
            <h2 className="text-xl my-3 font-medium text-gray-200">
              How many days?
            </h2>

            <Input
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="e.g., 5"
              className="w-full p-3 bg-white/80 backdrop-blur-md rounded-xl shadow-sm"
            />
          </div>

          {/* BUDGET */}
          <div className="mt-10">
            <h2 className="text-xl my-3 font-medium text-gray-200">
              Your Budget?
            </h2>

            <div className="grid grid-cols-3 gap-5 mt-5">
              {selectbudgetoptions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedBudget(item.title)}
                  className={`
                    p-5 rounded-2xl cursor-pointer 
                    bg-white/20 backdrop-blur-md border border-white/30 
                    shadow-md hover:shadow-xl hover:bg-white/30 
                    transition-all hover:scale-[1.03]
                    ${selectedBudget === item.title
                      ? "bg-white/50 border-white/80 scale-[1.04]"
                      : ""}
                  `}
                >
                  <h2 className="text-4xl">{item.icon}</h2>
                  <h2 className="font-bold">{item.title}</h2>
                  <p className="text-gray-800">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* TRAVELERS */}
          <div className="mt-10">
            <h2 className="text-xl my-3 font-semibold text-gray-200">
              Who are you traveling with?
            </h2>

            <div className="grid grid-cols-3 gap-5 mt-5">
              {SelectTravelesList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedTraveler(item.title)}
                  className={`
                    p-5 rounded-2xl cursor-pointer 
                    bg-white/20 backdrop-blur-md border border-white/30 
                    shadow-md hover:shadow-xl hover:bg-white/30 
                    transition-all hover:scale-[1.03]
                    ${selectedTraveler === item.title
                      ? "bg-white/50 border-white/80 scale-[1.04]"
                      : ""}
                  `}
                >
                  <h2 className="text-4xl">{item.icon}</h2>
                  <h2 className="font-bold">{item.title}</h2>
                  <p className="text-gray-800">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* BUTTON */}
          <div className="my-20 flex justify-center items-center">
            <Button
            type="button"
              disabled={loading}
              onClick={handleGenerate}
              className="flex items-center justify-center 
                px-16 py-7 text-white text-lg 
                bg-gray/10 backdrop-blur-lg 
                border border-white/20 rounded-xl 
                hover:bg-white/20 transition-all shadow-lg 
              "
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
              ) : (
                "Generate Trip"
              )}
            </Button>
            

             {errorMsg && (
  <div className="fixed bottom-6 right-6 z-[9999] 
                  bg-yellow-100 border border-yellow-400 
                  text-yellow-900 px-4 py-3 rounded-lg shadow-xl">
    ⚠️{errorMsg}
  </div>
)}
          </div>
        </div>

        {/* LOGIN POPUP */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
  <DialogContent className="rounded-2xl p-0 overflow-hidden">

    <div
      className="relative p-8 flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/login.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      {/* Soft Overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-3">

        <img
          src="/logoipsum-405.svg"
          className="h-14 opacity-90 drop-shadow-md"
        />

        <h2 className="font-bold text-3xl text-black drop-shadow">
          Welcome Back!
        </h2>

        <p className="text-sm text-gray-800">
          Sign in to continue your journey
        </p>

        <Button
          onClick={login}
          className="
            w-full py-3 flex gap-3 items-center justify-center
            bg-white/40 hover:bg-white/60
            border border-white/50
            backdrop-blur-md
            text-black font-semibold
            rounded-xl shadow-lg transition-all
          "
        >
          <FcGoogle className="h-6 w-6 bg-white rounded-full p-1" />
          Sign In with Google
        </Button>

      </div>
    </div>

  </DialogContent>
</Dialog>

      </div>
    </div>
  );
};

export default CreateTrip;
