import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Firestore, getDocs, collection, query, where } from 'firebase/firestore';
import { firestore } from '../../firebase.config';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {
  email: string = '';
  password: string = '';
  error: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  signInWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
  
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        this.error = false;
        this.errorMessage = '';

        
        // Store the user's email in local storage
        
        
        this.checkUserProfile(user);
        console.log("Successfully signed in with Google");
        this.checkUserProfile(user);

        if (user.email) {
          localStorage.setItem('userEmail', user.email);
          console.log("Email successfully stored in local storage:", user.email);
        }
        
      })
      .catch((error) => {
        this.error = true;
        this.errorMessage = `Error signing in with Google: ${error.message}`;
      });
  }
  

  signUpWithGoogleAndNavigate() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
  
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Successfully signed in with Google during sign-up");
        this.error = false;
        this.errorMessage = '';
        
        // Navigate to 'pages/editPerfilU' after successful Google Sign-In
        this.router.navigate(['pages/editPerfilU']);
      })
      .catch((error) => {
        console.error(" ", error);
        this.error = true;
        this.errorMessage = `Existio un error: ${error.message}`;
      });
  }

  checkUserProfile(user: any) {
    const userEmail = user.email;
    const usersCollection = collection(firestore, 'users');
    const emailQuery = query(usersCollection, where('email', '==', userEmail));

    getDocs(emailQuery).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData['role'] === "administrador") {
            this.router.navigate(['pages/Main']);
          } else {
            this.router.navigate(['pages/editPerfilU']);
          }
          this.authService.setEmail(userEmail);
        });
      } else {
        console.log("No profile found for this email.");
        this.router.navigate(['pages/Perfil']);
      }
    }).catch((error) => {
      console.error("Error checking user profile: ", error);
      this.router.navigate(['pages/Perfil']);
    });
  }
}
