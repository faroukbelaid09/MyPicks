import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyABnyG6uH01aImgL8FB4m6MiHeEU5E5aAs",
  authDomain: "mypicks-ab6a8.firebaseapp.com",
  projectId: "mypicks-ab6a8",
  storageBucket: "mypicks-ab6a8.firebasestorage.app",
  messagingSenderId: "1092760978954",
  appId: "1:1092760978954:web:bc4833b4fc992d7d6e41f3"
};

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)