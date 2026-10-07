import { EstadoEnum } from "./estado-enum"


/* "fecha_hora": "2026-09-29T16:00:00.000Z" */

export interface turnos{
  "id": number
    "fecha_hora": string
    "paciente": {
      "id": number,
      "documento": string,
      "apellidos": string,
      "nombres": string,
      "email": string,
      "estado": EstadoEnum,
      "rol": "PACIENTE"
    }
    "valor_Consulta":number
    "estado":EstadoEnum

}