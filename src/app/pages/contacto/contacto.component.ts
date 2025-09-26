import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService, Reserva } from '../../services/supabase.service';

// Angular Material imports
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// Registrar locale español
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es');

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
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: {
        parse: {
          dateInput: 'DD/MM/YYYY'
        },
        display: {
          dateInput: 'DD/MM/YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'DD/MM/YYYY',
          monthYearA11yLabel: 'MMMM YYYY'
        }
      }
    }
  ],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactPageComponent implements OnInit, AfterViewInit {
  @ViewChild('picker') picker: any;
  
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

  // Horarios por día de la semana (0 = Domingo, 1 = Lunes, 2 = Martes, etc.)
  horariosPorDia: { [key: number]: string[] } = {
    2: [ // Martes
      '08:00', '09:00', '10:00', '11:00', '12:00',
      '15:00', '16:00', '17:00', '18:00', '19:00'
    ],
    3: [ // Miércoles
      '08:00', '09:00', '10:00', '11:00', '12:00',
      '15:00', '16:00', '17:00', '18:00', '19:00'
    ],
    4: [ // Jueves
      '08:00', '09:00', '10:00', '11:00', '12:00',
      '15:00', '16:00', '17:00', '18:00', '19:00'
    ],
    5: [ // Viernes
      '08:00', '09:00', '10:00', '11:00', '12:00',
      '15:00', '16:00', '17:00', '18:00', '19:00'
    ],
    6: [ // Sábado
      '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'
    ]
  };

  horarios: string[] = []; // Se llenará dinámicamente según el día seleccionado

  selectedTime = '';

  constructor(private fb: FormBuilder, private supabaseService: SupabaseService, private dateAdapter: DateAdapter<Date>) {
    this.reservaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      servicio: ['', Validators.required],
      fecha: [null, Validators.required], // Cambiar a null para Material DatePicker
      comentarios: ['']
    });
    
    // Configurar el locale del DateAdapter
    this.dateAdapter.setLocale('es-ES');
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

  ngAfterViewInit() {
    // Actualizar el mes mostrado cuando se abre el calendario
    this.updateCalendarMonth();
  }

  updateCalendarMonth(selectedDate?: Date) {
    setTimeout(() => {
      const dateToUse = selectedDate || new Date();
      const monthNames = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
      const currentMonth = monthNames[dateToUse.getMonth()];
      
      // Actualizar el CSS con el mes actual
      const existingStyle = document.querySelector('#calendar-month-style');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      const style = document.createElement('style');
      style.id = 'calendar-month-style';
      style.textContent = `
        ::ng-deep .mat-calendar-header::before {
          content: '${currentMonth}' !important;
        }
      `;
      document.head.appendChild(style);
    }, 100);
  }

  async updateHorariosDisponibles(fecha?: string) {
    if (!fecha) {
      this.horariosDisponibles = [];
      this.horariosOcupados = [];
      this.horarios = [];
      return;
    }

    try {
      // Crear objeto Date y obtener el día de la semana
      const fechaObj = new Date(fecha + 'T00:00:00'); // Agregar tiempo para evitar problemas de zona horaria
      const diaSemana = fechaObj.getDay();
      
      // Obtener horarios para este día específico
      this.horarios = this.horariosPorDia[diaSemana] || [];
      
      if (this.horarios.length === 0) {
        // Si no hay horarios para este día, está cerrado
        this.horariosDisponibles = [];
        this.horariosOcupados = [];
        return;
      }

      // Obtener horarios ocupados de la base de datos
      this.horariosOcupados = await this.supabaseService.obtenerHorariosOcupados(fecha);
      
      // Filtrar horarios disponibles
      this.horariosDisponibles = this.horarios.filter(horario => 
        !this.horariosOcupados.includes(horario)
      );
    } catch (error) {
      console.error('Error actualizando horarios:', error);
      this.horariosDisponibles = [];
      this.horarios = [];
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

  // Filtro para deshabilitar días (deshabilitar lunes y domingos)
  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const day = date.getDay();
    // Permitir solo martes (2), miércoles (3), jueves (4), viernes (5) y sábado (6)
    return day >= 2 && day <= 6;
  }

  // Método para manejar cambios en la fecha de Material
  onMaterialDateChange(event: any) {
    const fecha = event.value;
    if (fecha) {
      const diaSemana = fecha.getDay();
      
      // Actualizar el mes mostrado
      this.updateCalendarMonth(fecha);
      
      // Verificar si es un día válido (martes a sábado)
      if (this.horariosPorDia[diaSemana] && this.horariosPorDia[diaSemana].length > 0) {
        this.fechaSeleccionada = true;
        // Convertir Date a string formato YYYY-MM-DD para compatibilidad
        const fechaString = fecha.toISOString().split('T')[0];
        this.updateHorariosDisponibles(fechaString);
        this.selectedTime = ''; // Limpiar horario seleccionado
      } else {
        this.fechaSeleccionada = false;
        this.horariosDisponibles = [];
        this.horarios = [];
      }
    } else {
      this.fechaSeleccionada = false;
      this.horariosDisponibles = [];
      this.horarios = [];
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
            const diaSemana = fecha.getDay();
            
            // Verificar si es un día de trabajo (martes a sábado)
            if (this.horariosPorDia[diaSemana] && this.horariosPorDia[diaSemana].length > 0) {
              this.fechaSeleccionada = true;
              const fechaString = fecha.toISOString().split('T')[0];
              this.updateHorariosDisponibles(fechaString);
              this.selectedTime = ''; // Limpiar horario seleccionado
              
              // Actualizar el valor del formulario con la fecha parseada
              this.reservaForm.patchValue({ fecha: fecha });
            } else {
              this.fechaSeleccionada = false;
              this.horariosDisponibles = [];
              this.horarios = [];
              console.log('Día no disponible - Solo trabajamos martes a sábado');
            }
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
      this.horariosDisponibles = [];
      this.horarios = [];
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

  // Método para obtener información del horario del día seleccionado
  getHorarioInfo(): string {
    const fecha = this.reservaForm.get('fecha')?.value;
    if (fecha && fecha instanceof Date) {
      const diaSemana = fecha.getDay();
      const nombresDias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      const nombreDia = nombresDias[diaSemana];
      
      switch (diaSemana) {
        case 2: // Martes
        case 3: // Miércoles  
        case 4: // Jueves
        case 5: // Viernes
          return `${nombreDia}: 8:00-12:00 y 15:00-19:00`;
        case 6: // Sábado
          return `${nombreDia}: 8:00-15:00`;
        default:
          return 'Día no disponible';
      }
    }
    return '';
  }
}
