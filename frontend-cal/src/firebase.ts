// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBB9KqWmNUALkf6yfKUjpBuk1G6_KkM27k",
    authDomain: "calm-f48cd.firebaseapp.com",
    projectId: "calm-f48cd",
    storageBucket: "calm-f48cd.firebasestorage.app",
    messagingSenderId: "1043868232419",
    appId: "1:1043868232419:web:813b65f9c5f9336edcf3d6",
    measurementId: "G-EHEJR1WE2W"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { auth };