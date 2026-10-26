import { EstadoReservaEnum } from "./estado-reserva-enum"

export interface TurnosMedicoModel {

  idReserva: number
  valorConsulta: number
  estado: EstadoReservaEnum
  idMedico: number
  idPaciente: number
  apellidosPaciente: string
  nombresPaciente: string
  emailPaciente: string
  estadoPaciente: string
  rolPaciente: string
  fechaTurno: string

}