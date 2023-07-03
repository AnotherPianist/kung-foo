import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { writable } from "svelte/store";

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

function userStore() {
  let unsubscribe: () => void;

  if (!auth || !globalThis.window) {
    console.warn("Auth is not initialized or not in the browser");
    const { subscribe } = writable<User | null>(null);
    return { subscribe };
  }

  const { subscribe } = writable(auth?.currentUser ?? null, set => {
    unsubscribe = onAuthStateChanged(auth, user => set(user));

    return () => unsubscribe();
  });

  return { subscribe };
}

export const user = userStore();