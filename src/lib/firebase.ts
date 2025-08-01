// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwEolx81dICW505joMYE03E6T92Bex5vg",
  authDomain: "attendance-ai-xur9q.firebaseapp.com",
  projectId: "attendance-ai-xur9q",
  storageBucket: "attendance-ai-xur9q.firebasestorage.app",
  messagingSenderId: "30376040039",
  appId: "1:30376040039:web:c096dda53175e0243366c2"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);
