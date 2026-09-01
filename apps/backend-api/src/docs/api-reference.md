# 📚 API Reference - Gamificación Nutricional (CRUD)

**URL Base:** `http://localhost:3000`

---

## 1. Planes Nutricionales (Plantillas)

### Crear Plantilla de Plan

Genera un nuevo plan nutricional relacional y devuelve un código de acceso único generado de forma segura.

- **URL:** `/generate-plan-code`
- **Method:** `POST`
- **Content-Type:** `application/json`

#### Request Body

| Campo               | Tipo      | Requerido | Descripción                                         |
| :------------------ | :-------- | :-------: | :-------------------------------------------------- |
| `nombre`            | `string`  |    Sí     | Nombre descriptivo (ej: "Plan Keto").               |
| `duracionEnSemanas` | `number`  |    Sí     | Semanas de duración del ciclo.                      |
| `esReutilizable`    | `boolean` |    Sí     | Indica si el código sirve para múltiples pacientes. |
| `semanas`           | `array`   |    Sí     | Arreglo de semanas con sus respectivas comidas.     |

**Estructura de `semanas[].comidas[]`:**

- `diaDeLaSemana`: `'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo'`
- `tipoDeComida`: `'Desayuno' | 'Almuerzo' | 'Merienda' | 'Cena'`
- `descripcion`: Instrucciones detalladas de la comida.

#### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Plantilla y comidas guardadas exitosamente",
  "codigoAcceso": "KETO8X9A"
}
```

---

### Obtener Plantilla por Código

Recupera el "molde" del plan completo con todas sus comidas anidadas a través de un Join en Supabase. Ideal para renderizar la vista del paciente en el frontend.

- **URL:** `/api/plans/:codigoAcceso`
- **Method:** `GET`
- **Parámetros de Ruta:** `codigoAcceso` (string) - El código alfanumérico generado al crear el plan.

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nombre": "Plan de Descenso Básico",
    "duracion_semanas": 4,
    "es_reutilizable": true,
    "codigo_acceso": "KETO8X9A",
    "created_at": "2026-09-01T19:42:40.000Z",
    "comidas": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "plantilla_id": "550e8400-e29b-41d4-a716-446655440000",
        "numero_semana": 1,
        "dia_semana": "Lunes",
        "tipo_comida": "Desayuno",
        "descripcion": "2 tostadas con huevo revuelto"
      }
    ]
  }
}
```

#### Error Response (404 Not Found)

```json
{
  "success": false,
  "message": "Plantilla no encontrada"
}
```

---

### Eliminar Plantilla

Elimina un plan nutricional completo. Ejecuta un borrado en cascada que limpia automáticamente todas las comidas asociadas en la base de datos.

- **URL:** `/api/plans/:id`
- **Method:** `DELETE`
- **Parámetros de Ruta:** `id` (UUID) - El identificador único del registro de la plantilla.

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Plantilla y comidas asociadas eliminadas exitosamente"
}
```
