// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
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
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);


export { app, auth, db };
