// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyADve0GEutUqzbuJ4LDkkLubL8DqQms4jQ',
  authDomain: 'vicharanashala-calm.firebaseapp.com',
  projectId: 'vicharanashala-calm',
  storageBucket: 'vicharanashala-calm.firebasestorage.app',
  messagingSenderId: '339283531284',
  appId: '1:339283531284:web:5810e6c27b4c7fbf95f901',
  measurementId: 'G-4B0ZKXKFSH',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication
const auth = getAuth(app)

export { auth }
