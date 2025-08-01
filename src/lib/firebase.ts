// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwEolx81dICW505joMYE03E6T92Bex5vg",
  authDomain: "attendance-ai-xur9q.firebaseapp.com",
  projectId: "attendance-ai-xur9q",
  storageBucket: "attendance-ai-xur9q.appspot.com",
  messagingSenderId: "30376040039",
  appId: "1:30376040039:web:c096dda53175e0243366c2"
};

// Initialize Firebase for Singleton Pattern
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
