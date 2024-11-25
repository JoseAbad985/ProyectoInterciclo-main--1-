import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { AuthService } from '../../firestore.config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-perfil-elegido',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule,CommonModule],
  templateUrl: './editar-perfil-elegido.component.html',
  styleUrls: ['./editar-perfil-elegido.component.scss'] // Ensure this path is correct
})
export class EditarPerfilElegidoComponent implements OnInit {
  userForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      apellido: ['', Validators.required],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      nombre: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      rol: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    // Retrieve the email from local storage
    const storedEmail = localStorage.getItem('editarEmail');
    if (storedEmail) {
      try {
        // Query Firestore for user data based on email
        const userDocRef = doc(db, 'users', storedEmail);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('User data fetched:', userData);

          // Prefill the form with the user's data
          this.userForm.patchValue({
            apellido: userData['apellido'],
            cedula: userData['cedula'],
            email: userData['email'],
            telefono: userData['telefono'],
            nombre: userData['nombre'],
            fecha_nacimiento: userData['fechaNac']
              ? new Date(userData['fechaNac'].seconds * 1000).toISOString().substring(0, 10)
              : '',
            rol: userData['role'] || ''
          });
        } else {
          console.error('No user found with the given email.');
          this.errorMessage = 'No se encontró el usuario.';
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
        this.errorMessage = 'Error al obtener los datos del usuario.';
      }
    } else {
      console.warn('No email found in local storage.');
      this.errorMessage = 'No se encontró el email en el almacenamiento local.';
    }
  }

  async actualizar() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const { cedula, email, rol } = this.userForm.value;

    try {
      const userRef = doc(db, 'users', email);
      // Merge the new data with the existing user data
      await setDoc(
        userRef,
        {
          apellido: this.userForm.value.apellido,
          cedula,
          email,
          fechaNac: new Date(this.userForm.value.fecha_nacimiento),
          nombre: this.userForm.value.nombre,
          telefono: this.userForm.value.telefono,
          role: rol
        },
        { merge: true }
      );

      console.log('User data has been successfully updated in Firestore.');
      this.successMessage = 'El usuario ha sido actualizado correctamente.';

      // Navigate to another page after a delay
      setTimeout(() => {
        this.router.navigate(['/listar-usuarios']);
      }, 2000);

    } catch (error) {
      console.error('Error updating user data: ', error);
      this.errorMessage = 'Hubo un error al actualizar el usuario.';
    }
  }

  // Method to navigate back to the user list
  goToUserList(): void {
    this.router.navigate(['/listar-usuarios']);
  }
}
