import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDUtyqxJIOsBZKBC-EP-KK_0ubz--2asmo",
  authDomain: "rn-social-project-bfa0b.firebaseapp.com",
  projectId: "rn-social-project-bfa0b",
  storageBucket: "rn-social-project-bfa0b.appspot.com",
  messagingSenderId: "617444830428",
  appId: "1:617444830428:web:0b7db10db0bce52dde5819",
  measurementId: "G-QPRP62R8K5",
 storageBucket:'gs://rn-social-project-bfa0b.appspot.com/'
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
