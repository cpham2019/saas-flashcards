import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyDS9_q3y5p-h8O0wKWdjLSdmMDi8iVtiSQ",
    authDomain: "flashcards-39cc4.firebaseapp.com",
    projectId: "flashcards-39cc4",
    storageBucket: "flashcards-39cc4.appspot.com",
    messagingSenderId: "466025370646",
    appId: "1:466025370646:web:a5d106d5a009a4195e1137",
    measurementId: "G-W2QE7LW6VM"
  };

  const app = getApps().length === 0 ?  initializeApp(firebaseConfig) : getApp();

  const db = getFirestore(app);
  const storage = getStorage(app);

  export { app, db, storage };