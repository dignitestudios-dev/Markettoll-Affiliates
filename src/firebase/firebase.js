import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, addDoc,query,getDocs,serverTimestamp,getDoc,updateDoc,onSnapshot } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8us3uTEnm7u43cqJHTVRCzaSHC2PzKNA",
  authDomain: "markettoll-12722.firebaseapp.com",
  databaseURL: "https://markettoll-12722-default-rtdb.firebaseio.com",
  projectId: "markettoll-12722",
  storageBucket: "markettoll-12722.firebasestorage.app",
  messagingSenderId: "415697624629",
  appId: "1:415697624629:web:bdb82c4ee69379c463db7c",
  measurementId: "G-9BPJW8MKXF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(app);

export { app, db, collection, doc, setDoc, addDoc,query,getDocs,serverTimestamp,getDoc,updateDoc,onSnapshot};
