import { EstadoReservaEnum } from "./estado-reserva-enum"

//Interfaz que define la estructura de datos para una reserva o turno médico
export interface ReservaModel {
  idReserva: number
  idMedico: number
  idPaciente: number
  fechaTurno: string
  valorConsulta: number
  estado: EstadoReservaEnum
}

