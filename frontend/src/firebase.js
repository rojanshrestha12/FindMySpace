import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCyP3Bzot_DjT-nWzD7iklNu3BeJmOc93I",
    authDomain: "find-my-space-918d0.firebaseapp.com",
    projectId: "find-my-space-918d0",
    storageBucket: "find-my-space-918d0.firebasestorage.app",
    messagingSenderId: "824423363684",
    appId: "1:824423363684:web:2539c87582a8dda8381b71",
    measurementId: "G-FX7DQE7E7N",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const token = await result.user.getIdToken();
        return token; 
    } catch (error) {
        console.error("Error with Google login:", error);
        return null;
    }
};

export const loginWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        return token; // Pass this token to your backend
    } catch (error) {
        console.error("Error with email login:", error);
        return null;
    }
};
