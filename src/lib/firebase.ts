import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAO-MyvNLyYw5zwI6Qd3I1pqOcU_tb6gdM",
  authDomain: "kung-foo-834c0.firebaseapp.com",
  projectId: "kung-foo-834c0",
  storageBucket: "kung-foo-834c0.appspot.com",
  messagingSenderId: "824604283495",
  appId: "1:824604283495:web:2adfa97f0d359c4c88bac2"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
