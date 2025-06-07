// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzELrMOwJ3NVrEzk65zZjeMwQZJOn3rVs",
  authDomain: "justride-1.firebaseapp.com",
  projectId: "justride-1",
  storageBucket: "justride-1.firebasestorage.app",
  messagingSenderId: "569907938577",
  appId: "1:569907938577:web:60e1e4051fabde5660f8b0",
  measurementId: "G-Z9KGQSNEWY"
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Export for use in Login/Signup
export { auth, db };
