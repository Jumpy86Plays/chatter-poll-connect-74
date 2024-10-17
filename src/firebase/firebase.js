import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCUUwjhif34NLRkWk2fwR2L-TfLlc_fjH8",
  authDomain: "live-discussion-room.firebaseapp.com",
  databaseURL: "https://live-discussion-room-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "live-discussion-room",
  storageBucket: "live-discussion-room.appspot.com",
  messagingSenderId: "267267876972",
  appId: "1:267267876972:web:a4340dd77bc24fadce1049",
  measurementId: "G-FPZH41125K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);