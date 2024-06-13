import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAgoAVJ9we-TM9kVI7ypoNuZ4Up5g9vZkU",
  authDomain: "imoneytask.firebaseapp.com",
  projectId: "imoneytask",
  storageBucket: "imoneytask.appspot.com",
  messagingSenderId: "615334957757",
  appId: "1:615334957757:web:ad919c4aa582d017375dd4",
  measurementId: "G-4HWLY30833"
};

const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
