import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase.config'; // Adjust the path as needed
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-editar-perfil',
  standalone: true, // Declare as a standalone component
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.scss'],
  imports: [CommonModule,ReactiveFormsModule] // Import CommonModule for directives like *ngIf
})
export class EditarPerfilComponent implements OnInit {
  userForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

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
      const userEmail = user.email;
      this.fetchUserData(userEmail);
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
          } else {
            // Handle other possible formats if necessary
            fechaNacimientoValue = '';
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
        console.log('No user found with that email.');
        this.errorMessage = 'No se encontró el usuario.';
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
      
      // Optionally, redirect or refresh the page after a delay
      setTimeout(() => {
        this.router.navigate(['/pages/Main']);
      }, 2000);
    } catch (error) {
      console.error('Error updating user data:', error);
      this.errorMessage = 'Error al actualizar el perfil.';
    }
  }

  // Method to navigate back to the main page
  goToUserList(): void {
    this.router.navigate(['/Main']);
  }
}
