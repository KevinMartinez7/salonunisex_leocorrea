import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService, Reserva } from '../../services/supabase.service';

// Angular Material imports
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
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
      fecha: [null, Validators.required], // Cambiar a null para Material DatePicker
      comentarios: ['']
    });
  }

  ngOnInit() {
    // Inicializar horarios disponibles
    this.updateHorariosDisponibles();
    
    // Actualizar horarios cuando cambie la fecha
    this.reservaForm.get('fecha')?.valueChanges.subscribe(fecha => {
      if (fecha && fecha instanceof Date) {
        this.fechaSeleccionada = true;
        // Convertir Date a string para el servicio
        const fechaString = fecha.toISOString().split('T')[0];
        this.updateHorariosDisponibles(fechaString);
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

  // Métodos para Angular Material DatePicker
  getMinDateForMaterial(): Date {
    return new Date();
  }

  getMaxDateForMaterial(): Date {
    const today = new Date();
    const maxDate = new Date(today.setMonth(today.getMonth() + 2));
    return maxDate;
  }

  // Filtro para deshabilitar días (opcional - por ejemplo deshabilitar domingos)
  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const day = date.getDay();
    // Puedes personalizar esto para deshabilitar días específicos
    // Por ahora permitimos todos los días
    return true;
  }

  // Método para manejar cambios en la fecha de Material
  onMaterialDateChange(event: any) {
    const fecha = event.value;
    if (fecha) {
      this.fechaSeleccionada = true;
      // Convertir Date a string formato YYYY-MM-DD para compatibilidad
      const fechaString = fecha.toISOString().split('T')[0];
      this.updateHorariosDisponibles(fechaString);
      this.selectedTime = ''; // Limpiar horario seleccionado
    } else {
      this.fechaSeleccionada = false;
    }
  }

  // Método para manejar la entrada manual de fechas
  onDateInput(event: any) {
    const inputValue = event.target.value;
    
    // Si el usuario escribe manualmente, intentar parsear la fecha
    if (inputValue && inputValue.length >= 8) {
      try {
        let fecha: Date;
        
        // Si tiene formato DD/MM/YYYY o DD-MM-YYYY, convertir a formato ISO
        if (inputValue.includes('/') || inputValue.includes('-')) {
          const separator = inputValue.includes('/') ? '/' : '-';
          const parts = inputValue.split(separator);
          
          if (parts.length === 3) {
            // Asumir formato DD/MM/YYYY
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1; // Los meses en JS empiezan en 0
            const year = parseInt(parts[2]);
            fecha = new Date(year, month, day);
          } else {
            fecha = new Date(inputValue);
          }
        } else {
          fecha = new Date(inputValue);
        }
        
        // Verificar si la fecha es válida
        if (!isNaN(fecha.getTime())) {
          // Verificar si está dentro del rango permitido
          const minDate = this.getMinDateForMaterial();
          const maxDate = this.getMaxDateForMaterial();
          
          if (fecha >= minDate && fecha <= maxDate) {
            this.fechaSeleccionada = true;
            const fechaString = fecha.toISOString().split('T')[0];
            this.updateHorariosDisponibles(fechaString);
            this.selectedTime = ''; // Limpiar horario seleccionado
            
            // Actualizar el valor del formulario con la fecha parseada
            this.reservaForm.patchValue({ fecha: fecha });
          } else {
            this.fechaSeleccionada = false;
            console.log('Fecha fuera del rango permitido');
          }
        } else {
          this.fechaSeleccionada = false;
        }
      } catch (error) {
        this.fechaSeleccionada = false;
        console.log('Error parseando fecha manual:', error);
      }
    } else {
      this.fechaSeleccionada = false;
    }
  }

  async onSubmit() {
    if (this.isFormValid()) {
      this.isLoading = true;
      
      try {
        const formData = this.reservaForm.value;
        const selectedService = this.servicios.find(s => s.value === formData.servicio);

        // Convertir fecha para base de datos
        const fechaParaBD = formData.fecha.toISOString().split('T')[0];

        // Verificar disponibilidad una vez más antes de guardar
        const disponible = await this.supabaseService.verificarDisponibilidad(fechaParaBD, this.selectedTime);
        
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
          fecha: fechaParaBD, // Usar la fecha convertida
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
        const fechaFormateada = formData.fecha.toLocaleDateString('es-ES', {
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
    if (fecha && fecha instanceof Date) {
      return fecha.toLocaleDateString('es-ES');
    }
    return '';
  }

  getFormattedDateForDisplay(): string {
    const fecha = this.reservaForm.get('fecha')?.value;
    if (fecha && fecha instanceof Date) {
      return fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return '';
  }
}
