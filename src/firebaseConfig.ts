// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_APIKEY_FIREBASE}`,
  authDomain: `${import.meta.env.VITE_AUTHDOMAIN_FIREBASE}`,
  projectId: `${import.meta.env.VITE_PROJECTID_FIREBASE}`,
  storageBucket: `${import.meta.env.VITE_STORAGEBUCKET_FIREBASE}`,
  messagingSenderId: `${import.meta.env.VITE_MESSAGE_FIREBASE}`,
  appId: `${import.meta.env.VITE_APPID_FIREBASE}`,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
