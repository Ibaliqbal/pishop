// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdIL6nqlW6Dmah-En9SkEffbrgN5g7PdA",
  authDomain: "ecommerce-simple-e6c1f.firebaseapp.com",
  projectId: "ecommerce-simple-e6c1f",
  storageBucket: "ecommerce-simple-e6c1f.appspot.com",
  messagingSenderId: "378558960884",
  appId: "1:378558960884:web:869e5200f8849f39cc7aa1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider()
