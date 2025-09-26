import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
 <div class="flex flex-col min-h-screen">
  <!-- Contenido principal -->
  <main class="flex-grow flex justify-center items-center py-12">
    <div class="w-full max-w-2xl">
      <form class="card p-10 space-y-6" [formGroup]="form" (ngSubmit)="onSubmit()">
        <h2 class="text-3xl font-bold mb-6">Contacto</h2>

        <div>
          <label class="block mb-2 text-lg font-medium">Nombre</label>
          <input type="text" formControlName="nombre" class="w-full border rounded-lg p-4 text-lg" />
        </div>

        <div>
          <label class="block mb-2 text-lg font-medium">Email</label>
          <input type="email" formControlName="email" class="w-full border rounded-lg p-4 text-lg" />
        </div>

        <div>
          <label class="block mb-2 text-lg font-medium">Mensaje</label>
          <textarea formControlName="mensaje" rows="6" class="w-full border rounded-lg p-4 text-lg"></textarea>
        </div>

        <button type="submit" class="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
          Enviar
        </button>
      </form>
    </div>
  </main>
</div>


  `,
  styles: [``],
})
export class ContactPageComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    // ✅ ahora sí, primero se inicializa fb en el constructor
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Formulario enviado:', this.form.value);
      alert('¡Mensaje enviado con éxito!');
      this.form.reset();
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  }
}
