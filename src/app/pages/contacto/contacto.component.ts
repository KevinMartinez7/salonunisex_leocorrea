import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService, Reserva } from '../../services/supabase.service';

// Registrar locale español
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule
  ],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactPageComponent implements OnInit, AfterViewInit {
  
  reservaForm: FormGroup;
  horariosDisponibles: string[] = [];
  horariosOcupados: string[] = [];
  isLoading = false;
  fechaSeleccionada = false;
  showMapModal = false;
  showConfirmationModal = false;
  
  servicios = [
    { value: 'corte-degrade', label: 'Corte Clásico', precio: '$15.000' },
    { value: 'Clasico-tijera', label: 'Fade / Degradé', precio: '$15.000' },
    //{ value: 'afeitado-premium', label: 'Afeitado Premium', precio: '$12' },
    { value: 'corte-barba', label: 'Corte + Barba', precio: '$17.000' },
    { value: 'unisex-color', label: 'Unisex & Color', precio: '$60.000' },
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

  // Propiedades para calendario personalizado
  currentDate = new Date();
  selectedDate: Date | null = null;
  calendarDays: any[] = [];
  monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
               'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  weekdays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  constructor(private fb: FormBuilder, private supabaseService: SupabaseService) {
    this.reservaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      servicio: ['', Validators.required],
      fecha: [null, Validators.required], // Para nuestro calendario personalizado
      comentarios: ['']
    });
  }

  ngOnInit() {
    // Inicializar horarios disponibles
    this.updateHorariosDisponibles();
    
    // Inicializar calendario personalizado
    this.generateCalendar();
    
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
    // Ya no necesario para el calendario personalizado
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
        
        // Mostrar modal de confirmación
        this.showConfirmationModal = true;
        
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

  // === MÉTODOS PARA CALENDARIO PERSONALIZADO ===
  
  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);
    
    // Días del mes anterior para completar la primera semana
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Días del mes siguiente para completar la última semana
    const endDate = new Date(lastDay);
    const remainingDays = 6 - lastDay.getDay();
    endDate.setDate(endDate.getDate() + remainingDays);
    
    // Generar array de días
    this.calendarDays = [];
    const currentDateIterator = new Date(startDate);
    
    while (currentDateIterator <= endDate) {
      const isCurrentMonth = currentDateIterator.getMonth() === month;
      const isToday = this.isSameDate(currentDateIterator, new Date());
      const isSelected = this.selectedDate && this.isSameDate(currentDateIterator, this.selectedDate);
      const dayOfWeek = currentDateIterator.getDay();
      const isDisabled = !this.isDateAvailable(currentDateIterator);
      
      this.calendarDays.push({
        date: new Date(currentDateIterator),
        day: currentDateIterator.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        isDisabled,
        hasEvents: this.hasEvents(currentDateIterator)
      });
      
      currentDateIterator.setDate(currentDateIterator.getDate() + 1);
    }
  }
  
  isDateAvailable(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // No permitir fechas pasadas
    if (date < today) return false;
    
    // No permitir fechas más de 2 meses en el futuro
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2);
    if (date > maxDate) return false;
    
    // Solo permitir días de trabajo (martes a sábado)
    const dayOfWeek = date.getDay();
    return dayOfWeek >= 2 && dayOfWeek <= 6;
  }
  
  hasEvents(date: Date): boolean {
    // Aquí puedes agregar lógica para mostrar eventos específicos
    return false;
  }
  
  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
  
  selectDate(day: any) {
    if (day.isDisabled || !day.isCurrentMonth) return;
    
    this.selectedDate = new Date(day.date);
    this.fechaSeleccionada = true;
    
    // Actualizar el formulario
    this.reservaForm.patchValue({ fecha: this.selectedDate });
    
    // Actualizar horarios disponibles
    const fechaString = this.selectedDate.toISOString().split('T')[0];
    this.updateHorariosDisponibles(fechaString);
    this.selectedTime = '';
    
    // Regenerar calendario para mostrar selección
    this.generateCalendar();
  }
  
  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }
  
  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }
  
  getCurrentMonthYear(): string {
    return `${this.monthNames[this.currentDate.getMonth()]} de ${this.currentDate.getFullYear()}`;
  }
  
  // Métodos para el modal del mapa
  openMapModal() {
    this.showMapModal = true;
    document.body.style.overflow = 'hidden'; // Prevenir scroll del fondo
  }
  
  closeMapModal() {
    this.showMapModal = false;
    document.body.style.overflow = 'auto'; // Restaurar scroll
  }
  
  // Métodos para el modal de confirmación
  closeConfirmationModal() {
    this.showConfirmationModal = false;
    document.body.style.overflow = 'auto'; // Restaurar scroll
  }
}
