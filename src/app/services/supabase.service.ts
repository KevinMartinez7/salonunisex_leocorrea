import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface Reserva {
  id?: number;
  nombre: string;
  telefono: string;
  email: string;
  servicio: string;
  fecha: string;
  horario: string;
  comentarios?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private tableName = 'reservas_peluqueria_leo_correa';

  constructor() {
    const supabaseUrl = 'https://poeakqcynxbrksdvxwmw.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZWFrcWN5bnhicmtzZHZ4d213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTg3OTMsImV4cCI6MjA3MjQzNDc5M30.1glKTBCdPI6zQXtMFRwdA4WU9J3Iu5c5RIuKRxPGJaw';
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verificar conexión al inicializar
    this.verificarConexion();
  }

  // Verificar conexión con Supabase
  async verificarConexion() {
    try {
      console.log('Verificando conexión con Supabase...');
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error de conexión con Supabase:', error);
        if (error.code === '42P01') {
          console.error(`❌ La tabla "${this.tableName}" no existe. Por favor ejecuta el script SQL en Supabase.`);
        }
      } else {
        console.log('✅ Conexión con Supabase exitosa');
      }
    } catch (error) {
      console.error('Error verificando conexión:', error);
    }
  }

  // Crear una reserva
  async crearReserva(reserva: Omit<Reserva, 'id' | 'created_at'>): Promise<{ data: Reserva | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert([reserva])
        .select()
        .single();

      if (error) {
        console.error('Error de Supabase al crear reserva:', error);
      } else {
        console.log('✅ Reserva creada exitosamente:', data);
      }

      return { data, error };
    } catch (error) {
      console.error('Error en crearReserva:', error);
      return { data: null, error };
    }
  }

  // Verificar disponibilidad de un horario específico
  async verificarDisponibilidad(fecha: string, horario: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('fecha', fecha)
        .eq('horario', horario);

      if (error) {
        console.error('Error verificando disponibilidad:', error);
        return true; // En caso de error, permitir la reserva
      }

      return data.length === 0; // Disponible si no hay reservas
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
      return true;
    }
  }

  // Obtener horarios ocupados para una fecha específica
  async obtenerHorariosOcupados(fecha: string): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('horario')
        .eq('fecha', fecha);

      if (error) {
        console.error('Error obteniendo horarios ocupados:', error);
        return [];
      }

      return data.map(reserva => reserva.horario);
    } catch (error) {
      console.error('Error obteniendo horarios ocupados:', error);
      return [];
    }
  }

  // Obtener todas las reservas
  async obtenerReservas(): Promise<Reserva[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error obteniendo reservas:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error obteniendo reservas:', error);
      return [];
    }
  }
}