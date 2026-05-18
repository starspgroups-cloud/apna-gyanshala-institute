import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDc6yUZ2dRC4LNeIhVJ-du1-C9e0jymnS8",
  authDomain: "apna-gyanshala-institute.firebaseapp.com",
  projectId: "apna-gyanshala-institute",
  storageBucket: "apna-gyanshala-institute.firebasestorage.app",
  messagingSenderId: "530002808022",
  appId: "1:530002808022:web:fe1309b6b74d4154674d77"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;