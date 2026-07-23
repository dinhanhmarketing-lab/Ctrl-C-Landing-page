import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyA8NYJOTmsoX19u5pyAw7z6E6WszJmTUwQ",
  authDomain: "ctrl-c-byanhdinh.firebaseapp.com",
  projectId: "ctrl-c-byanhdinh",
  storageBucket: "ctrl-c-byanhdinh.firebasestorage.app",
  messagingSenderId: "915147925168",
  appId: "1:915147925168:web:7a0afb649a5f4ec3ef3d75",
  measurementId: "G-S3CJLF1LM5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics conditionally for browser safety
export let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
