import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCnOHy8w1uAXOiLI7bXTPFo-qrkbr4T6_c",
  authDomain: "classtrack-5de60.firebaseapp.com",
  projectId: "classtrack-5de60",
  storageBucket: "classtrack-5de60.firebasestorage.app",
  messagingSenderId: "688846147032",
  appId: "1:688846147032:web:a452d80545ae95f2e6b6ad",
  measurementId: "G-FSRQB7W1EC"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
