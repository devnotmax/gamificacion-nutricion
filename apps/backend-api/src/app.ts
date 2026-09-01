import express from "express";
import cors from "cors";
import { randomBytes } from "crypto";
import { Request, Response } from "express";
import { CrearPlantillaResponse, CrearPlantillaBody } from "./types/index";

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
app.post("/generate-plan-code", (req: Request, res: Response) => {
  const plantilla: CrearPlantillaBody = req.body;
  const planCode = generatePlanCode();

  const response: CrearPlantillaResponse = {
    success: true,
    message: "Código generado exitosamente",
    codigoAcceso: planCode,
  };

  res.status(201).json(response);
});

app.get("/", (req, res) => {
  res.json({
    message: "API funcionando",
  });
});

export default app;
