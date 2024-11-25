import { Component, OnInit } from '@angular/core';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone : true,
  templateUrl: './perfil.component.html',
  imports: [ReactiveFormsModule,CommonModule],
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  userForm: FormGroup;
  emailEntrada: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.emailEntrada = localStorage.getItem('email') || ''; // Carga el correo desde localStorage
    if (!this.emailEntrada) {
      console.warn('No se encontró un correo en localStorage.');
    }


    this.userForm = this.fb.group({
      apellido: ['', Validators.required],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: [this.emailEntrada, [Validators.required, Validators.email]], // Prellenar con el correo
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      nombre: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      rol: ['', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    console.log('ngOnInit triggered in perfil.component.ts');
    console.log("Retrieving email from local storage...");
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.emailEntrada = localStorage.getItem('userEmail') || ''; // Default to empty string if null
    console.log("Email retrieved:", this.emailEntrada);
    if (this.emailEntrada) {
      try {
        const userDocRef = doc(db, 'users', this.emailEntrada);
        const userDoc = await getDoc(userDocRef);
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.userForm.patchValue({
            apellido: userData['apellido'] || '',
            cedula: userData['cedula'] || '',
            email: userData['email'] || '',
            telefono: userData['telefono'] || '',
            nombre: userData['nombre'] || '',
            fecha_nacimiento: userData['fechaNac']
              ? new Date(userData['fechaNac'].seconds * 1000).toISOString().substring(0, 10)
              : '',
            rol: userData['role'] || '',
          });
        } else {
          console.warn('No se encontraron datos del usuario en Firestore.');
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    } else {
      console.warn('No se encontró un correo en localStorage.');
    }
  }
  
  

  async onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const { cedula, email, rol } = this.userForm.value;

    try {
      const userRef = doc(db, 'users', email);
      await setDoc(
        userRef,
        {
          apellido: this.userForm.value.apellido,
          cedula,
          email,
          fechaNac: new Date(this.userForm.value.fecha_nacimiento),
          nombre: this.userForm.value.nombre,
          telefono: this.userForm.value.telefono,
          role: rol,
        },
        { merge: true }
      );

      if (rol === 'administrador') {
        this.router.navigate(['pages/Main']);
      } else {
        this.router.navigate(['pages/editPerfilU']);
      }

      console.log('Datos del usuario actualizados en Firestore.');
    } catch (error) {
      console.error('Error al guardar los datos en Firestore:', error);
    }
  }
}
