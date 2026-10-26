import { EstadoReservaEnum } from "./estado-reserva-enum"

//Interfaz que define la estructura detallada de un turno o reserva médica
export interface TurnosModel {
  idReserva: number
  idPaciente: number
  nombreMedico: string
  apellidoMedico: string
  fechaTurno: string
  valorConsulta: number
  estado: EstadoReservaEnum
}

