// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBq5fTO95rIDgT736B3kn9Y6zpcaEL3ooE",
  authDomain: "finpod-io.firebaseapp.com",
  projectId: "finpod-io",
  storageBucket: "finpod-io.appspot.com",
  messagingSenderId: "280572248249",
  appId: "1:280572248249:web:b96d50e4aa5beba1e45b68",
  measurementId: "G-4F5KKVRCV6",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
