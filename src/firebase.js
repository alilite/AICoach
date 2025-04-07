import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCLMcCWzznEguysu9qlGn52s5L15_2kiD8",
  authDomain: "fitnessapp-b699e.firebaseapp.com",
  projectId: "fitnessapp-b699e",
  storageBucket: "fitnessapp-b699e.appspot.com", 
  messagingSenderId: "896539479800",
  appId: "1:896539479800:web:580b55b489edef6a0af50d"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
