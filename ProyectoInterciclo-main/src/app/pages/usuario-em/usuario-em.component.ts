import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase.config'; // Adjust the path as needed
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuario-em',
  standalone: true,
  templateUrl: './usuario-em.component.html',
  styleUrls: ['./usuario-em.component.scss'],
  imports: [CommonModule, ReactiveFormsModule] // Import CommonModule for directives like *ngIf
})
export class UsuarioEmComponent implements OnInit {
  userForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  email: string = ''; // Add an email variable to store the current user's email

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    // Initialize the form with validators
    this.userForm = this.fb.group({
      apellido: ['', Validators.required],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      nombre: ['', Validators.required],
      fecha_nacimiento: [{ value: '', disabled: true }, Validators.required],
      rol: [{ value: '', disabled: true }, Validators.required]
    });
  }

  ngOnInit(): void {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user && user.email) {
      // Fetch the current user's email directly from Firebase Auth
      this.email = user.email;
      this.userForm.patchValue({ email: this.email }); // Pre-fill the email field
      this.fetchUserData(this.email);
    } else {
      console.warn('No user is currently logged in.');
      this.errorMessage = 'No hay un usuario autenticado.';
      // Redirect to the login page if no user is logged in
      this.router.navigate(['/login']);
    }
  }

  async fetchUserData(email: string) {
    try {
      const userDocRef = doc(db, 'users', email);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Retrieved user data:', userData);

        // Handle fechaNac field
        let fechaNacimientoValue = '';
        if (userData['fechaNac']) {
          if (userData['fechaNac'].seconds) {
            // It's a Firestore Timestamp
            fechaNacimientoValue = new Date(userData['fechaNac'].seconds * 1000)
              .toISOString()
              .substring(0, 10);
          } else if (typeof userData['fechaNac'] === 'string') {
            // It's a string
            fechaNacimientoValue = userData['fechaNac'];
          }
        }

        // Patch the form with the user's data
        this.userForm.patchValue({
          apellido: userData['apellido'],
          cedula: userData['cedula'],
          email: userData['email'],
          telefono: userData['telefono'],
          nombre: userData['nombre'],
          fecha_nacimiento: fechaNacimientoValue,
          rol: userData['role'] || ''
        });
      } else {
        // If the user does not exist in the database, pre-fill the email and leave other fields blank
        console.log('No user found with that email. Pre-filling email field.');
        this.userForm.patchValue({
          email: email
        });
        this.errorMessage = 'Usuario no registrado. Complete sus datos.';
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      this.errorMessage = 'Error al obtener los datos del usuario.';
    }
  }

  async actualizar() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    // Prepare the updated user data
    const fechaNacimientoInput = this.userForm.getRawValue().fecha_nacimiento;
    const updatedUser = {
      apellido: this.userForm.value.apellido,
      cedula: this.userForm.value.cedula,
      email: this.userForm.getRawValue().email, // Get the value from the disabled control
      telefono: this.userForm.value.telefono,
      nombre: this.userForm.value.nombre,
      fechaNac: fechaNacimientoInput, // Store as string
      role: this.userForm.getRawValue().rol // Get the value from the disabled control
    };

    try {
      const userRef = doc(db, 'users', updatedUser.email);
      await setDoc(userRef, updatedUser, { merge: true });
      console.log('User data has been successfully updated.');
      this.successMessage = 'La actualización fue exitosa.';
    } catch (error) {
      console.error('Error updating user data:', error);
      this.errorMessage = 'Error al actualizar el perfil.';
    }
  }

  // Method to navigate back to the main page
  goToMainPage(): void {
    this.router.navigate(['/pages/inicio']);
  }
}
