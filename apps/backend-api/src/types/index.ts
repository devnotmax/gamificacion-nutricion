export type DiaDeLaSemana =
  | "Lunes"
  | "Martes"
  | "Miércoles"
  | "Jueves"
  | "Viernes"
  | "Sábado"
  | "Domingo";
export type TipoDeComida = "Desayuno" | "Almuerzo" | "Merienda" | "Cena";

export interface ComidaDiaria {
  diaDeLaSemana: DiaDeLaSemana;
  tipoDeComida: TipoDeComida;
  descripcion: string;
}

export interface PlanSemanal {
  numeroSemana: number; // Ej: 1, 2, 3, 4
  comidas: ComidaDiaria[];
}

// Interfaz estricta para el req.body que enviará el frontend del nutricionista
export interface CrearPlantillaBody {
  nombre: string;
  duracionEnSemanas: number;
  esReutilizable: boolean;
  semanas: PlanSemanal[];
}

// Interfaz (opcional) para estructurar la respuesta de tu API
export interface CrearPlantillaResponse {
  success: boolean;
  message: string;
  codigoAcceso: string;
}
