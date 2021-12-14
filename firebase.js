import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA7u_P_Z_o9asFkuAlw7CiUwGqVc6l3u0Y",
  authDomain: "my-chat-app-b9a26.firebaseapp.com",
  projectId: "my-chat-app-b9a26",
  storageBucket: "my-chat-app-b9a26.appspot.com",
  messagingSenderId: "26131514578",
  appId: "1:26131514578:web:6465f1d06fa17f899c990b"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();

export { db, auth, provider }