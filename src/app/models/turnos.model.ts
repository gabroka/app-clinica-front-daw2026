import { EstadoReservaEnum } from "./estado-reserva-enum"



/* "fecha_hora": "2026-09-29T16:00:00.000Z" */
/* turnos de un paciente especifico api/reservas/paciente/${+id} */

export interface TurnosModel {
  idReserva: number
  idPaciente: number
  nombreMedico: string
  apellidoMedico: string
  fechaTurno: string
  valorConsulta: number
  estado: EstadoReservaEnum
}

/* export interface TurnosModel {
  id: number
  medico: {
    id: number
    idUsuario: number
    matricula: number
    valorConsulta: number
  }
  fecha_hora: string
  valor_Consulta: number
  estado: EstadoReservaEnum

} */