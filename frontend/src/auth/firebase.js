// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyP3Bzot_DjT-nWzD7iklNu3BeJmOc93I",
  authDomain: "find-my-space-918d0.firebaseapp.com",
  projectId: "find-my-space-918d0",
  storageBucket: "find-my-space-918d0.firebasestorage.app",
  messagingSenderId: "824423363684",
  appId: "1:824423363684:web:2539c87582a8dda8381b71",
  measurementId: "G-FX7DQE7E7N"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
