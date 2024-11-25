import { Injectable } from '@angular/core';
import { auth, firestore } from '../firebase.config'; // Ensure your Firebase config is correctly imported
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { Firestore, doc, getDoc, getFirestore, collection, query, where, getDocs, DocumentSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  email = '';

  private firestore: Firestore;

  constructor() {
    // Initialize Firestore
    this.configurePersistence();
    this.firestore = getFirestore();
    this.initializeUser();
  }

  private initializeUser() {
    // Listen to authentication state changes
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userSubject.next(user);
      } else {
        this.userSubject.next(null);
      }
    });
  }

  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  logIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password).then((result) => {
      const user = result.user;
      if (user && user.email) {
        localStorage.setItem('email', user.email);  
        this.setEmail(user.email); // Guarda el correo al iniciar sesión
      }
      return result;
    });
  }

  logOut() {
    return auth.signOut().then(() => {
      localStorage.removeItem('userEmail'); // Limpia el correo al cerrar sesión
    });
  }

  // Method to get user profile by UID
  getUserProfile(uid: string): Promise<DocumentSnapshot> {
    const userRef = doc(this.firestore, 'users', uid); // Firestore path
    return getDoc(userRef); // Fetch the document
  }

  // New method to get user profile by email
  getUserProfileByEmail(email: string): Promise<QuerySnapshot<DocumentData>> {
    const usersCollection = collection(this.firestore, 'users');
    const emailQuery = query(usersCollection, where('email', '==', email));
    return getDocs(emailQuery);
  }

  setEmail = (email: string): void => {
    this.email = email;
    console.log('Email to store:', email); // Check if email has a value
    localStorage.setItem('userEmail', email);
  };

  setEmailEditar = (email: string): void => {
    this.email = email;
    localStorage.setItem('editarEmail', email);
    console.log('Editar email es: ', email);
  };

  // Get email
  getEmail(): string | null {
    return this.email || localStorage.getItem('userEmail');
  }

  async configurePersistence() {
    const auth = getAuth();
    try {
      await setPersistence(auth, browserLocalPersistence);
      console.log('Persistencia configurada exitosamente');
    } catch (error) {
      console.error('Error al configurar la persistencia:', error);
    }
  }

}
