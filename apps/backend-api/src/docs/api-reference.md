# 📚 API Reference - Gamificación Nutricional

URL Base: `http://localhost:3000`

---

## 1. Planes Nutricionales

### Crear Plantilla de Plan

Genera un nuevo plan nutricional (molde) y devuelve un código de acceso único alfanumérico que el profesional puede compartir con sus pacientes.

- **URL:** `/generate-plan-code`
- **Method:** `POST`
- **Content-Type:** `application/json`

#### Parámetros del Body (Request)

| Campo               | Tipo      | Requerido | Descripción                                                                      |
| :------------------ | :-------- | :-------: | :------------------------------------------------------------------------------- |
| `nombre`            | `string`  |    Sí     | Nombre descriptivo de la plantilla (ej: "Plan Keto 30 Días").                    |
| `duracionEnSemanas` | `number`  |    Sí     | Cantidad total de semanas que dura el ciclo del plan.                            |
| `esReutilizable`    | `boolean` |    Sí     | `true` si el código sirve para múltiples pacientes, `false` si es para uno solo. |
| `semanas`           | `array`   |    Sí     | Arreglo que contiene la estructura semanal.                                      |

**Estructura interna de `semanas`:**

- `numeroSemana` (_number_): Identificador numérico de la semana (ej: 1, 2, 3).
- `comidas` (_array_): Lista de comidas programadas para esa semana específica.
  - `diaDeLaSemana` (_string_): Solo acepta `'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo'`.
  - `tipoDeComida` (_string_): Solo acepta `'Desayuno' | 'Almuerzo' | 'Merienda' | 'Cena'`.
  - `descripcion` (_string_): Texto libre con las indicaciones de la comida.

#### Success response

- Code: 201 Created
- Content:
  {
  "success": true,
  "message": "Código generado exitosamente",
  "codigoAcceso": "H7K9M2PW4X9Y"
  }

#### Request Body de Ejemplo

```json
{
  "nombre": "Plan de Descenso Básico",
  "duracionEnSemanas": 4,
  "esReutilizable": true,
  "semanas": [
    {
      "numeroSemana": 1,
      "comidas": [
        {
          "diaDeLaSemana": "Lunes",
          "tipoDeComida": "Desayuno",
          "descripcion": "2 tostadas de pan integral con huevo revuelto y café negro."
        },
        {
          "diaDeLaSemana": "Lunes",
          "tipoDeComida": "Almuerzo",
          "descripcion": "Bife de pollo a la plancha con ensalada mixta y porción de arroz."
        },
        {
          "diaDeLaSemana": "Lunes",
          "tipoDeComida": "Merienda",
          "descripcion": "Yogur descremado con una fruta."
        },
        {
          "diaDeLaSemana": "Lunes",
          "tipoDeComida": "Cena",
          "descripcion": "Filet de merluza al horno con puré de calabaza."
        }
      ]
    }
  ]
}
```
