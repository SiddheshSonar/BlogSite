// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider  } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpYlukQgBK5dTNrXHk5ONtLGRIcOHIuqM",
  authDomain: "blogspress-9652c.firebaseapp.com",
  projectId: "blogspress-9652c",
  storageBucket: "blogspress-9652c.appspot.com",
  messagingSenderId: "821366164464",
  appId: "1:821366164464:web:6775373d711fe1ac1d2b35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();