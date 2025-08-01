// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "attendance-ai-xur9q",
  "appId": "1:30376040039:web:c096dda53175e0243366c2",
  "storageBucket": "attendance-ai-xur9q.firebasestorage.app",
  "apiKey": "AIzaSyAwEolx81dICW505joMYE03E6T92Bex5vg",
  "authDomain": "attendance-ai-xur9q.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "30376040039"
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