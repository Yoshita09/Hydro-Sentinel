// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrI8kyDdRc66Go5K3T30l2DDK_4hduZ0s",
  authDomain: "hydrosentinel-21666.firebaseapp.com",
  databaseURL: "https://hydrosentinel-21666-default-rtdb.firebaseio.com",
  projectId: "hydrosentinel-21666",
  storageBucket: "hydrosentinel-21666.firebasestorage.app",
  messagingSenderId: "765853504075",
  appId: "1:765853504075:web:0808ec460a6573de0733ce",
  measurementId: "G-SSN7FJL2Y3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue };