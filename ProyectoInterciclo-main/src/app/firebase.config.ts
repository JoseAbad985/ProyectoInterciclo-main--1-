
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { Firestore } from "@angular/fire/firestore";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCZmgcSA1PZkiXi38mS7qy3Sp6zc8KTljo",
  authDomain: "proyectoparqueo-fa595.firebaseapp.com",
  projectId: "proyectoparqueo-fa595",
  storageBucket: "proyectoparqueo-fa595.firebasestorage.app",
  messagingSenderId: "231247304917",
  appId: "1:231247304917:web:83cab8e8cb78d8c1cc2a5c",
  measurementId: "G-30F66EGY5B"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app); 
const db = getFirestore(app);

export { auth, analytics,firestore,db };