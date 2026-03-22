import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgfrsIwdnOOIjQLsZWVE8e19ocLiXF610",
  authDomain: "thomas-portfolio-b1151.firebaseapp.com",
  projectId: "thomas-portfolio-b1151",
  storageBucket: "thomas-portfolio-b1151.firebasestorage.app",
  messagingSenderId: "110774127455",
  appId: "1:110774127455:web:476493314ab1a5435084ea"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database and export it so store.js can use it
const db = getFirestore(app);

export { db };
