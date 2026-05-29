-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Crear la secuencia para los números de presupuesto
CREATE SEQUENCE IF NOT EXISTS presupuesto_correlativo_seq START 1;
GRANT USAGE ON SEQUENCE presupuesto_correlativo_seq TO anon, authenticated, service_role;

-- 2. Crear la función que genera y asigna el formato 2026-0001
CREATE OR REPLACE FUNCTION generar_numero_correlativo_presupuesto()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.numero_correlativo IS NULL THEN
    NEW.numero_correlativo := to_char(CURRENT_DATE, 'YYYY') || '-' || lpad(nextval('presupuesto_correlativo_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Crear el trigger para la tabla presupuestos
DROP TRIGGER IF EXISTS trigger_presupuestos_numero_correlativo ON presupuestos;
CREATE TRIGGER trigger_presupuestos_numero_correlativo
BEFORE INSERT ON presupuestos
FOR EACH ROW
EXECUTE FUNCTION generar_numero_correlativo_presupuesto();

-- NOTA: Las columnas en lineas_presupuesto (especificaciones y nota_exclusiones) 
-- y presupuestos (numero_correlativo) ya se abordaron previamente en su esquema o 
-- puedes correr esto si no existen:

ALTER TABLE presupuestos ADD COLUMN IF NOT EXISTS numero_correlativo TEXT;
ALTER TABLE lineas_presupuesto ADD COLUMN IF NOT EXISTS especificaciones JSONB DEFAULT '[]'::jsonb;
ALTER TABLE lineas_presupuesto ADD COLUMN IF NOT EXISTS nota_exclusiones TEXT DEFAULT NULL;
