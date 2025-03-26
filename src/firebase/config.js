import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD6Q3CkHoCzkJd-hW_kp6wp_R2sCbDWzrk",
    authDomain: "quiz-c2d60.firebaseapp.com",
    projectId: "quiz-c2d60",
    storageBucket: "quiz-c2d60.appspot.com", // Fixed storage bucket URL
    messagingSenderId: "49798147325",
    appId: "1:49798147325:web:765e84c1ce17cd5a14e294",
    measurementId: "G-3GLQN85LDH"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
