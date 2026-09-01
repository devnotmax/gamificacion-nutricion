import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Cargar las variables de entorno
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Faltan las variables de entorno de Supabase. Verifica tu archivo .env",
  );
}

// Inicializamos el cliente
export const supabase = createClient(supabaseUrl, supabaseKey);
