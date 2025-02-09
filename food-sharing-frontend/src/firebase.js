// Import Firebase SDK modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // If using Firestore database

// Firebase project configuration (from Firebase Console → Project Settings)
const firebaseConfig = {
  apiKey: "AIzaSyC6RuC7KFhSYtb3uZOMHpN9yGGo5-mQ9V0", // Replace this with your actual API key
  authDomain: "node-c2749.firebaseapp.com",
  projectId: "node-c2749",
  storageBucket: "node-c2749.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // (Optional)
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Authentication module
export const auth = getAuth(app);

// Firestore database (if needed)
export const db = getFirestore(app);
