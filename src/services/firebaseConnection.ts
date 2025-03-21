// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAcxhF6iDEpSfusxk0JRA5kURqvMGEyhhU",
  authDomain: "board-tarefa.firebaseapp.com",
  projectId: "board-tarefa",
  storageBucket: "board-tarefa.firebasestorage.app",
  messagingSenderId: "349149890891",
  appId: "1:349149890891:web:ea9609ec3e28216e71c0ce",
  measurementId: "G-WEKJF2MS0T"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
export { db };

