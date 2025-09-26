-- Crear tabla de reservas en Supabase
-- Ejecuta este SQL en el SQL Editor de Supabase

CREATE TABLE public.reservas_peluqueria_leo_correa (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    servicio VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,
    horario TIME NOT NULL,
    comentarios TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear índices para mejorar performance
CREATE INDEX idx_reservas_fecha_horario ON public.reservas_peluqueria_leo_correa(fecha, horario);
CREATE INDEX idx_reservas_fecha ON public.reservas_peluqueria_leo_correa(fecha);
CREATE INDEX idx_reservas_created_at ON public.reservas_peluqueria_leo_correa(created_at);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.reservas_peluqueria_leo_correa ENABLE ROW LEVEL SECURITY;

-- Política para permitir insertar reservas (cualquiera puede crear reservas)
CREATE POLICY "Permitir insertar reservas" ON public.reservas_peluqueria_leo_correa
    FOR INSERT WITH CHECK (true);

-- Política para permitir leer reservas (cualquiera puede ver horarios ocupados)
CREATE POLICY "Permitir leer reservas" ON public.reservas_peluqueria_leo_correa
    FOR SELECT USING (true);

-- Opcional: Política para actualizar/eliminar (solo para administradores)
-- CREATE POLICY "Solo admin puede actualizar" ON public.reservas
--     FOR UPDATE USING (auth.role() = 'admin');

-- CREATE POLICY "Solo admin puede eliminar" ON public.reservas
--     FOR DELETE USING (auth.role() = 'admin');