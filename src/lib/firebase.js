import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDZUl-eRgEV2I5nA7f4sjqbs_GCcCzYRUM",
  authDomain: "ymp2-76be2.firebaseapp.com",
  databaseURL: "https://ymp2-76be2-default-rtdb.firebaseio.com",
  projectId: "ymp2-76be2",
  storageBucket: "ymp2-76be2.firebasestorage.app",
  messagingSenderId: "866265084431",
  appId: "1:866265084431:web:211e63a984a63b1918697a",
  measurementId: "G-DKNNXGMJLR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { app, auth, db, storage, analytics };
