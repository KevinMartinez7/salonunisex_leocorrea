import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService, Reserva } from '../../services/supabase.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styles: [`
    .form-field {
      @apply mb-6;
    }
    .form-label {
      @apply block mb-2 text-lg font-medium text-gray-800;
    }
    .form-input {
      @apply w-full border-2 border-gray-300 rounded-xl p-4 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200;
    }
    .form-select {
      @apply w-full border-2 border-gray-300 rounded-xl p-4 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 bg-white;
    }
    .form-error {
      @apply text-red-600 text-sm mt-1;
    }
    .btn-primary {
      @apply bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto;
    }
    .time-grid {
      @apply grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3;
    }
    .time-button {
      @apply border-2 border-gray-300 rounded-lg p-3 text-center cursor-pointer transition-all duration-200 hover:border-blue-500 hover:bg-blue-50;
    }
    .time-button.selected {
      @apply border-blue-500 bg-blue-100 text-blue-700;
    }
    .time-button.disabled {
      @apply border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed;
    }
    
    /* Estilos personalizados para el calendario */
    .date-input-wrapper {
      position: relative;
    }
    
    .custom-date-input {
      @apply w-full border-2 border-gray-300 rounded-xl p-4 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 bg-white cursor-pointer;
      height: 60px;
      font-size: 20px;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%233b82f6'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M6.75 3v2.25M17.25 3v2.25m3 8.25v7.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18.75v-7.5M3 9.75h18M8.25 13.5h7.5'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 16px center;
      background-size: 28px;
      padding-right: 55px;
      transform: scale(1);
      transition: all 0.3s ease;
    }
    
    /* Hacer el indicador del calendario más clickeable */
    .custom-date-input::-webkit-calendar-picker-indicator {
      background: transparent;
      bottom: 0;
      color: transparent;
      cursor: pointer;
      height: 100%;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
      width: 100%;
      z-index: 100;
      /* Esto hace que todo el campo sea clickeable para abrir el calendario */
    }
    
    /* Efectos hover para el campo completo */
    .custom-date-input:hover {
      @apply border-blue-400 shadow-lg;
      transform: scale(1.01);
      background-size: 30px;
    }
    
    /* Hacer el calendario más grande cuando se abre */
    .custom-date-input:focus,
    .custom-date-input:active {
      transform: scale(1.02);
      @apply border-blue-500 ring-4 ring-blue-200 shadow-xl;
      z-index: 1000;
    }
    
    /* Estilos para hacer los campos de fecha más grandes */
    .custom-date-input::-webkit-datetime-edit {
      padding: 12px 8px;
      font-size: 20px;
      color: #1f2937;
      font-weight: 600;
    }
    
    .custom-date-input::-webkit-datetime-edit-fields-wrapper {
      padding: 8px;
      background: transparent;
      display: flex;
      align-items: center;
    }
    
    .custom-date-input::-webkit-datetime-edit-text {
      color: #6b7280;
      padding: 4px 6px;
      font-size: 20px;
      font-weight: 500;
    }
    
    .custom-date-input::-webkit-datetime-edit-month-field,
    .custom-date-input::-webkit-datetime-edit-day-field,
    .custom-date-input::-webkit-datetime-edit-year-field {
      background-color: transparent;
      color: #1f2937;
      font-weight: 700;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 20px;
      min-width: 50px;
      text-align: center;
      transition: all 0.2s ease;
      border: 2px solid transparent;
    }
    
    .custom-date-input::-webkit-datetime-edit-month-field:hover,
    .custom-date-input::-webkit-datetime-edit-day-field:hover,
    .custom-date-input::-webkit-datetime-edit-year-field:hover {
      background-color: #f3f4f6;
      border-color: #d1d5db;
    }
    
    .custom-date-input::-webkit-datetime-edit-month-field:focus,
    .custom-date-input::-webkit-datetime-edit-day-field:focus,
    .custom-date-input::-webkit-datetime-edit-year-field:focus {
      background-color: #dbeafe;
      color: #1d4ed8;
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    /* Placeholder personalizado */
    .date-placeholder {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
      font-size: 18px;
      pointer-events: none;
      transition: all 0.3s ease;
      font-weight: 500;
      z-index: 1;
    }
    
    .custom-date-input:focus + .date-placeholder,
    .custom-date-input:not(:placeholder-shown) + .date-placeholder,
    .has-value .date-placeholder {
      opacity: 0;
      transform: translateY(-50%) scale(0.8);
    }
    
    /* Animación para cuando se selecciona una fecha */
    .date-selected {
      @apply border-green-500 bg-green-50;
      animation: selectedPulse 0.6s ease-out;
    }
    
    .date-selected .date-placeholder {
      @apply text-green-600;
    }
    
    /* Indicador visual de fecha seleccionada */
    .date-selected::after {
      content: '✓';
      position: absolute;
      right: 50px;
      top: 50%;
      transform: translateY(-50%);
      color: #10b981;
      font-weight: bold;
      font-size: 22px;
      animation: checkmark 0.5s ease-out;
      z-index: 10;
    }
    
    @keyframes selectedPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.03); }
      100% { transform: scale(1); }
    }
    
    @keyframes checkmark {
      0% { opacity: 0; transform: translateY(-50%) scale(0.5); }
      100% { opacity: 1; transform: translateY(-50%) scale(1); }
    }
  `],
})
export class ContactPageComponent implements OnInit {
  reservaForm: FormGroup;
  horariosDisponibles: string[] = [];
  horariosOcupados: string[] = [];
  isLoading = false;
  fechaSeleccionada = false;
  
  servicios = [
    { value: 'corte-clasico', label: 'Corte Clásico', precio: '$15' },
    { value: 'fade-moderno', label: 'Fade / Degradé', precio: '$18' },
    { value: 'afeitado-premium', label: 'Afeitado Premium', precio: '$12' },
    { value: 'corte-barba', label: 'Corte + Barba', precio: '$25' },
    { value: 'unisex-color', label: 'Unisex & Color', precio: '$30' },
  ];

  horarios = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  selectedTime = '';

  constructor(private fb: FormBuilder, private supabaseService: SupabaseService) {
    this.reservaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      servicio: ['', Validators.required],
      fecha: ['', Validators.required],
      comentarios: ['']
    });
  }

  ngOnInit() {
    // Inicializar horarios disponibles
    this.updateHorariosDisponibles();
    
    // Actualizar horarios cuando cambie la fecha
    this.reservaForm.get('fecha')?.valueChanges.subscribe(fecha => {
      if (fecha) {
        this.fechaSeleccionada = true;
        this.updateHorariosDisponibles(fecha);
        this.selectedTime = ''; // Limpiar horario seleccionado
      } else {
        this.fechaSeleccionada = false;
      }
    });
  }

  async updateHorariosDisponibles(fecha?: string) {
    if (!fecha) {
      this.horariosDisponibles = [...this.horarios];
      this.horariosOcupados = [];
      return;
    }

    try {
      this.horariosOcupados = await this.supabaseService.obtenerHorariosOcupados(fecha);
      this.horariosDisponibles = this.horarios.filter(horario => 
        !this.horariosOcupados.includes(horario)
      );
    } catch (error) {
      console.error('Error actualizando horarios:', error);
      this.horariosDisponibles = [...this.horarios];
    }
  }

  // Método para abrir el calendario al hacer clic en el área
  abrirCalendario(event: any) {
    event.target.showPicker?.();
  }

  // Método para manejar cambios en la fecha
  onFechaChange(event: any) {
    const fecha = event.target.value;
    if (fecha) {
      this.fechaSeleccionada = true;
      this.updateHorariosDisponibles(fecha);
      this.selectedTime = ''; // Limpiar horario seleccionado
    } else {
      this.fechaSeleccionada = false;
    }
  }

  selectTime(time: string) {
    if (!this.horariosOcupados.includes(time)) {
      this.selectedTime = time;
    }
  }

  isTimeDisabled(time: string): boolean {
    return this.horariosOcupados.includes(time);
  }

  isFormValid(): boolean {
    return this.reservaForm.valid && this.selectedTime !== '';
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  getMaxDate(): string {
    const today = new Date();
    const maxDate = new Date(today.setMonth(today.getMonth() + 2));
    return maxDate.toISOString().split('T')[0];
  }

  async onSubmit() {
    if (this.isFormValid()) {
      this.isLoading = true;
      
      try {
        const formData = this.reservaForm.value;
        const selectedService = this.servicios.find(s => s.value === formData.servicio);

        // Verificar disponibilidad una vez más antes de guardar
        const disponible = await this.supabaseService.verificarDisponibilidad(formData.fecha, this.selectedTime);
        
        if (!disponible) {
          alert('Lo siento, este horario ya fue reservado. Por favor selecciona otro horario.');
          this.updateHorariosDisponibles(formData.fecha);
          this.selectedTime = '';
          this.isLoading = false;
          return;
        }

        // Crear objeto reserva para la base de datos
        const reserva: Omit<Reserva, 'id' | 'created_at'> = {
          nombre: formData.nombre,
          telefono: formData.telefono,
          email: formData.email,
          servicio: formData.servicio,
          fecha: formData.fecha,
          horario: this.selectedTime,
          comentarios: formData.comentarios || ''
        };

        // Guardar en la base de datos
        const { data, error } = await this.supabaseService.crearReserva(reserva);

        if (error) {
          console.error('Error guardando reserva:', error);
          console.error('Detalles del error:', JSON.stringify(error, null, 2));
          
          // Mostrar error más específico al usuario
          let errorMessage = 'Error al guardar la reserva.';
          if (error.message) {
            errorMessage += ` Detalle: ${error.message}`;
          }
          if (error.code) {
            errorMessage += ` (Código: ${error.code})`;
          }
          
          alert(errorMessage + ' Por favor intenta nuevamente.');
          this.isLoading = false;
          return;
        }

        // Formatear fecha para WhatsApp - evitando problemas de zona horaria
        const [year, month, day] = formData.fecha.split('-').map(Number);
        const fecha = new Date(year, month - 1, day); // month - 1 porque los meses van de 0-11
        const fechaFormateada = fecha.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        // Crear mensaje para WhatsApp
        const mensaje = `🔸 *NUEVA RESERVA - LEO CORREA BARBER* 🔸

👤 *Cliente:* ${formData.nombre}
📱 *Teléfono:* ${formData.telefono}
📧 *Email:* ${formData.email}

✂️ *Servicio:* ${selectedService?.label} (${selectedService?.precio})
📅 *Fecha:* ${fechaFormateada}
🕐 *Horario:* ${this.selectedTime}

${formData.comentarios ? `💬 *Comentarios:* ${formData.comentarios}` : ''}

✅ *Reserva confirmada y guardada en el sistema*

¡Te esperamos! 💪`;

        // Codificar mensaje para URL
        const mensajeCodificado = encodeURIComponent(mensaje);
        
        // Número de WhatsApp (Leo Correa Barber)
        const numeroWhatsApp = '5492494651747';
        
        // URL de WhatsApp
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
        
        // Abrir WhatsApp
        window.open(urlWhatsApp, '_blank');
        
        // Mostrar mensaje de éxito
        alert('¡Reserva guardada exitosamente! Te redirigimos a WhatsApp para confirmar.');
        
        // Reset form
        this.reservaForm.reset();
        this.selectedTime = '';
        this.updateHorariosDisponibles();
        
      } catch (error) {
        console.error('Error en onSubmit:', error);
        alert('Error al procesar la reserva. Por favor intenta nuevamente.');
      } finally {
        this.isLoading = false;
      }
    } else {
      alert('Por favor, completa todos los campos correctamente y selecciona un horario.');
    }
  }

  getFieldError(fieldName: string): string | null {
    const field = this.reservaForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['email']) return 'Email no válido';
      if (field.errors['minlength']) return `${fieldName} debe tener al menos 2 caracteres`;
      if (field.errors['pattern']) return 'Teléfono debe tener 10 dígitos';
    }
    return null;
  }

  getSelectedService() {
    const servicioValue = this.reservaForm.get('servicio')?.value;
    return this.servicios.find(s => s.value === servicioValue);
  }

  getFormattedDate(): string {
    const fecha = this.reservaForm.get('fecha')?.value;
    if (fecha) {
      // Evitar problemas de zona horaria creando la fecha correctamente
      const [year, month, day] = fecha.split('-').map(Number);
      const date = new Date(year, month - 1, day); // month - 1 porque los meses van de 0-11
      return date.toLocaleDateString('es-ES');
    }
    return '';
  }

  getFormattedDateForDisplay(): string {
    const fecha = this.reservaForm.get('fecha')?.value;
    if (fecha) {
      // Evitar problemas de zona horaria creando la fecha correctamente
      const [year, month, day] = fecha.split('-').map(Number);
      const date = new Date(year, month - 1, day); // month - 1 porque los meses van de 0-11
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return '';
  }
}
