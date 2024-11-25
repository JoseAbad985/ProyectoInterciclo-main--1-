// contratos.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebase.config';
import { AuthService } from '../../firestore.config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss']
})
export class ContratosComponent implements OnInit {
  contratoForm: any;
  clientes: any[] = [];
  selectedCliente: string | null = null;

  // Success and error messages
  successMessage: string = '';
  errorMessage: string = '';

  // Flag to prevent multiple submissions
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.contratoForm = this.fb.group({
      clienteId: ['', Validators.required],
      placaContrato: ['', [Validators.required, Validators.maxLength(7)]],
      inicioContrato: ['', Validators.required],
      finContrato: ['', Validators.required],
      estado: ['activo']
    });
  }

  ngOnInit(): void {
    this.getAllClientes();
  }

  getAllClientes(): Promise<any[]> {
    const clientesCollectionRef = collection(firestore, 'users');
    return getDocs(clientesCollectionRef).then((querySnapshot) => {
      let clientesList: any[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData['role'] === 'empleado') {
          clientesList.push({ id: doc.id, ...userData });
        }
      });
      this.clientes = clientesList;
      console.log("Retrieved users (empleados):", this.clientes);
      return clientesList;
    }).catch((error) => {
      console.error("Error fetching users (clientes):", error);
      return [];
    });
  }

  async registrarContrato() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    console.log("Iniciando registro de contrato");

    const clienteId = this.contratoForm.value.clienteId;
    const placaContrato = this.contratoForm.value.placaContrato;

    console.log("Cliente ID:", clienteId);
    console.log("Placa Contrato:", placaContrato);

    const inicioContrato = this.convertToDate(this.contratoForm.value.inicioContrato);
    const finContrato = this.convertToDate(this.contratoForm.value.finContrato);

    if (!inicioContrato || !finContrato) {
      console.error("Invalid date values provided");
      this.errorMessage = 'Por favor, ingrese fechas válidas.';
      this.isSubmitting = false;
      return;
    }

    const estado = this.contratoForm.value.estado;

    try {
      const contratosCollectionRef = collection(firestore, 'contratos');
      const newContractRef = await addDoc(contratosCollectionRef, {
        clienteId,
        placaContrato,
        inicioContrato,
        finContrato,
        estado
      });

      console.log("Contrato registrado correctamente con ID:", newContractRef.id);

      // Clear the form fields
      this.contratoForm.reset();
      this.contratoForm.controls['estado'].setValue('activo'); // Reset 'estado' field

      // Set the success message
      this.successMessage = 'Tu contrato se ingresó correctamente';

      // Scroll to the top of the form
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Optionally, hide the message after a few seconds
      setTimeout(() => {
        this.successMessage = '';
      }, 5000);

    } catch (error) {
      console.error("Error registrando contrato:", error);
      this.errorMessage = 'Hubo un error al registrar el contrato. Por favor, inténtalo de nuevo.';
    } finally {
      this.isSubmitting = false;
    }
  }

  convertToDate(dateValue: string): Date | null {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  }

  goToMainPage(): void {
    this.router.navigate(['pages/Main']); 
  }
}
