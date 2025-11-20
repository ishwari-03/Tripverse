// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore}  from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtso_MSZc47see1mS5LMeQDMgzWGfeEIQ",
  authDomain: "ai-trip-planner-adb57.firebaseapp.com",
  projectId: "ai-trip-planner-adb57",
  storageBucket: "ai-trip-planner-adb57.firebasestorage.app",
  messagingSenderId: "558872437954",
  appId: "1:558872437954:web:9711584bec24215673475b",
  measurementId: "G-SFXH9D0E5K"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)
//const analytics = getAnalytics(app);