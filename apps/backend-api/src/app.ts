import express from "express";
import cors from "cors";
import { randomBytes } from "crypto";
import { Request, Response } from "express";
import { CrearPlantillaResponse, CrearPlantillaBody } from "./types/index";
import { supabase } from "./config/supabase";

const app = express();

app.use(cors());
app.use(express.json());

//AC1 - Función pura que genera el codigo alfanumérico y genera el identificador del paciente
function generatePlanCode(length = 12): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(length);

  return Array.from(bytes)
    .map((byte) => chars[byte % chars.length])
    .join("");
}

//Testear la funcion

// app.get("/generate-plan-code", (req, res) => {
//   const planCode = generatePlanCode();
//   res.json({ planCode });
// });

//AC2 - Ruta POST que recibe el JSON del plan y genera el código
app.post(
  "/generate-plan-code",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const plantilla: CrearPlantillaBody = req.body;
      const planCode = generatePlanCode();

      // 1. Insertar el "Molde" padre
      const { data: plantillaGuardada, error: errorPlantilla } = await supabase
        .from("plantillas")
        .insert([
          {
            nombre: plantilla.nombre,
            duracion_semanas: plantilla.duracionEnSemanas,
            es_reutilizable: plantilla.esReutilizable,
            codigo_acceso: planCode,
          },
        ])
        .select()
        .single();

      if (errorPlantilla || !plantillaGuardada) {
        console.error("Error al guardar plantilla:", errorPlantilla);
        res
          .status(500)
          .json({ success: false, message: "Error al guardar la plantilla" });
        return;
      }

      // 2. Aplanar el array de semanas y comidas para la inserción masiva
      const comidasParaInsertar = plantilla.semanas.flatMap((semana) =>
        semana.comidas.map((comida) => ({
          plantilla_id: plantillaGuardada.id,
          numero_semana: semana.numeroSemana,
          dia_semana: comida.diaDeLaSemana,
          tipo_comida: comida.tipoDeComida,
          descripcion: comida.descripcion,
        })),
      );

      // 3. Insertar todas las comidas de una sola vez
      if (comidasParaInsertar.length > 0) {
        const { error: errorComidas } = await supabase
          .from("comidas_plantilla")
          .insert(comidasParaInsertar);

        if (errorComidas) {
          console.error("Error al guardar comidas:", errorComidas);
          // Opcional: Aquí podrías agregar lógica para borrar la plantilla huérfana (Rollback)
          res.status(500).json({
            success: false,
            message: "Error al guardar las comidas del plan",
          });
          return;
        }
      }

      res.status(201).json({
        success: true,
        message: "Plantilla y comidas guardadas exitosamente",
        codigoAcceso: planCode,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  },
);

app.get(
  "/api/plans/:codigoAcceso",
  async (req: Request, res: Response): Promise<void> => {
    const { codigoAcceso } = req.params;

    try {
      // Al agregar "comidas_plantilla(*)" dentro del select, Supabase busca automáticamente
      // todos los registros hijos que tengan el plantilla_id correspondiente.
      const { data: plantilla, error: errorPlantilla } = await supabase
        .from("plantillas")
        .select(
          `
        *,
        comidas:comidas_plantilla(*)
      `,
        )
        .eq("codigo_acceso", codigoAcceso)
        .single();

      if (errorPlantilla || !plantilla) {
        res
          .status(404)
          .json({ success: false, message: "Plantilla no encontrada" });
        return;
      }

      // Devolvemos el status 200 (OK) con la plantilla y sus comidas anidadas
      res.status(200).json({
        success: true,
        data: plantilla,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  },
);

app.delete(
  "/api/plans/:id",
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      // Solo borramos el molde; la base de datos elimina las comidas en cascada
      const { error } = await supabase.from("plantillas").delete().eq("id", id);

      if (error) {
        console.error("Error al eliminar:", error);
        res
          .status(500)
          .json({ success: false, message: "Error al eliminar la plantilla" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Plantilla y comidas asociadas eliminadas exitosamente",
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  },
);

app.get("/", (req, res) => {
  res.json({
    message: "API funcionando",
  });
});

export default app;
