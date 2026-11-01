import { EstadoReservaEnum } from "./estado-reserva-enum"
import { EstadoUsuarioEnum } from "./estado-usuario-enum"
import { RolEnum } from "./rol-enum"

export interface ListarTodasLasReservasModel {
  estado: EstadoReservaEnum
  fecha_hora: string
  id: number
  medico: {
    id: number
    idUsuario: number
    matricula: number
    valorConsulta: number
  }

  paciente: {
    apellidos: string
    documento: string
    email: string
    estado: EstadoUsuarioEnum
    id: number
    nombres: string
    rol: RolEnum
  }

  valor_consulta: number

}