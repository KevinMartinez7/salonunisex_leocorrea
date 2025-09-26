-- SCRIPT SIMPLIFICADO PARA CREAR TABLA DE RESERVAS
-- Ejecuta este SQL en el SQL Editor de Supabase

-- Crear tabla de reservas
CREATE TABLE IF NOT EXISTS public.reservas_peluqueria_leo_correa (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    telefono TEXT NOT NULL,
    email TEXT NOT NULL,
    servicio TEXT NOT NULL,
    fecha DATE NOT NULL,
    horario TEXT NOT NULL,
    comentarios TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar acceso público (RLS deshabilitado temporalmente para pruebas)
ALTER TABLE public.reservas_peluqueria_leo_correa DISABLE ROW LEVEL SECURITY;

-- Dar permisos completos temporalmente
GRANT ALL ON public.reservas_peluqueria_leo_correa TO anon;
GRANT ALL ON public.reservas_peluqueria_leo_correa TO authenticated;

-- Para el auto-increment
GRANT USAGE, SELECT ON SEQUENCE reservas_peluqueria_leo_correa_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE reservas_peluqueria_leo_correa_id_seq TO authenticated;