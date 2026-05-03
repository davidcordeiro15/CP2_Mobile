import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDp4jretVK7Hd273THN-fG7zkpCAjSuE4M",
  authDomain: "cp2-mobile-f47d1.firebaseapp.com",
  projectId: "cp2-mobile-f47d1",
  databaseURL: 'https://cp2-mobile-f47d1-default-rtdb.firebaseio.com/', 
  storageBucket: "cp2-mobile-f47d1.firebasestorage.app",
  messagingSenderId: "445480862839",
  appId: "1:445480862839:web:890ce894e1b810b2fcf272"
};


const app = initializeApp(firebaseConfig);
 
const auth = getAuth(app);
const db = getDatabase(app, firebaseConfig.databaseURL);
 
export { auth, db };