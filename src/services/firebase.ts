import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBd_w_ZdVjG04aB-aZZQy1dD9Atl7u6uBE",
  authDomain: "feg-encuentro-82453.firebaseapp.com",
  projectId: "feg-encuentro-82453",
  storageBucket: "feg-encuentro-82453.firebasestorage.app",
  messagingSenderId: "86445534988",
  appId: "1:86445534988:web:7fe35a199429ef3f232329",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
