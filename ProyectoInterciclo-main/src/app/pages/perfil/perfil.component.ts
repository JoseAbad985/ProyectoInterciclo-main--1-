import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class PerfilComponent implements OnInit {
  userForm: FormGroup;
  emailEntrada: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.emailEntrada = localStorage.getItem('userEmail') || '';

    this.userForm = this.fb.group({
      apellido: ['', Validators.required],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: [{ value: this.emailEntrada, disabled: true }, [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      nombre: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      rol: ['', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      if (!this.emailEntrada) {
        console.error('No email found in localStorage');
        alert('Error: No se encontró el email del usuario');
        this.router.navigate(['/login']);
        return;
      }

      await this.loadUserData();
    } catch (error) {
      console.error('Error in ngOnInit:', error);
      alert('Error al cargar los datos del usuario');
    }
  }

  private async loadUserData(): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', this.emailEntrada);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        this.userForm.patchValue({
          apellido: userData['apellido'] || '',
          cedula: userData['cedula'] || '',
          telefono: userData['telefono'] || '',
          nombre: userData['nombre'] || '',
          fecha_nacimiento: userData['fecha_nacimiento'] || '',
          rol: userData['rol'] || '',
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      throw error;
    }
  }

  async onSubmit(): Promise<void> {
    try {
      if (this.userForm.valid) {
        this.loading = true;
        
        // Get the complete form value including disabled fields
        const formData = {
          ...this.userForm.getRawValue(),
          email: this.emailEntrada, // Ensure we use the email from localStorage
          updatedAt: new Date().toISOString()
        };

        const userDocRef = doc(db, 'users', this.emailEntrada);
        
        await setDoc(userDocRef, formData, { merge: true });
        
        console.log('User data saved successfully:', formData);
        alert('Datos guardados exitosamente');
      } else {
        // Mark all fields as touched to trigger validation messages
        Object.keys(this.userForm.controls).forEach(key => {
          const control = this.userForm.get(key);
          control?.markAsTouched();
        });
        
        alert('Por favor, complete todos los campos requeridos correctamente');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      alert('Error al guardar los datos. Por favor, intente nuevamente');
    } finally {
      this.loading = false;
    }
  }
}