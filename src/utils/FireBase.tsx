import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMWw1usd3TcU10Ec7qrfUGzohNRb9euZ0",
  authDomain: "arklator.firebaseapp.com",
  projectId: "arklator",
  storageBucket: "arklator.firebasestorage.app",
  messagingSenderId: "566056457130",
  appId: "1:566056457130:web:c3ed8d01550b52301951d3",
  measurementId: "G-FGGNR650GM",
};

// Firebase 초기화
const firebaseApp = initializeApp(firebaseConfig);

// Firestore 데이터베이스 참조
const db = getFirestore(firebaseApp);

export { db };
