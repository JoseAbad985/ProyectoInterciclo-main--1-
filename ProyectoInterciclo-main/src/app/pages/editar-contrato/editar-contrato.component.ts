import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase.config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-contrato',
  standalone: true, // Add this line
  imports: [CommonModule, ReactiveFormsModule], // Include ReactiveFormsModule
  templateUrl: './editar-contrato.component.html',
  styleUrls: ['./editar-contrato.component.scss']
})
export class EditarContratoComponent implements OnInit {
  contratoForm: FormGroup;
  contratoId: string = '';
  loading: boolean = true;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.contratoForm = this.fb.group({
      clienteId: ['', Validators.required],
      placaContrato: ['', [Validators.required, Validators.maxLength(7)]],
      inicioContrato: ['', Validators.required],
      finContrato: ['', Validators.required],
      estado: ['']
    });
  }

  ngOnInit(): void {
    // Get the contract ID from the route parameters
    this.contratoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.contratoId) {
      this.loadContratoData();
    } else {
      this.errorMessage = 'ID de contrato no proporcionado.';
      this.loading = false;
    }
  }

  async loadContratoData() {
    try {
      const contratoDocRef = doc(firestore, 'contratos', this.contratoId);
      const contratoSnapshot = await getDoc(contratoDocRef);
      if (contratoSnapshot.exists()) {
        const contratoData = contratoSnapshot.data();

        // Populate the form with existing data
        this.contratoForm.setValue({
          clienteId: contratoData['clienteId'],
          placaContrato: contratoData['placaContrato'],
          inicioContrato: this.formatDate(contratoData['inicioContrato'].toDate()),
          finContrato: this.formatDate(contratoData['finContrato'].toDate()),
          estado: contratoData['estado']
        });
        this.loading = false;
      } else {
        this.errorMessage = 'El contrato no existe.';
        this.loading = false;
      }
    } catch (error) {
      console.error('Error al cargar los datos del contrato:', error);
      this.errorMessage = 'Hubo un error al cargar los datos del contrato.';
      this.loading = false;
    }
  }

  formatDate(date: Date): string {
    // Format the date to 'YYYY-MM-DD' for the date input
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  async actualizarContrato() {
    if (this.contratoForm.invalid) {
      return;
    }

    try {
      const contratoDocRef = doc(firestore, 'contratos', this.contratoId);

      await updateDoc(contratoDocRef, {
        clienteId: this.contratoForm.value.clienteId,
        placaContrato: this.contratoForm.value.placaContrato,
        inicioContrato: new Date(this.contratoForm.value.inicioContrato),
        finContrato: new Date(this.contratoForm.value.finContrato),
        estado: this.contratoForm.value.estado
      });

      this.successMessage = 'El contrato ha sido actualizado correctamente.';

      // Optionally, redirect back to the list after a delay
      setTimeout(() => {
        this.router.navigate(['/listar-contratos']);
      }, 3000);

    } catch (error) {
      console.error('Error al actualizar el contrato:', error);
      this.errorMessage = 'Hubo un error al actualizar el contrato.';
    }
  }
  goToUserList(): void {
    this.router.navigate(['/listar-contratos']);
  }
}
