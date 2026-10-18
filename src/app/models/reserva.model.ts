import { EstadoReservaEnum } from "./estado-reserva-enum"


/* agenda del medico por fecha
/api/reservas/medico/${medicoId}`,{
      params: {fecha} */
export interface ReservaModel {
  idReserva: number
  idMedico: number
  idPaciente: number
  fechaTurno: string
  valorConsulta: number
  estado: EstadoReservaEnum
}

/* export interface ReservaModel {
id:number
medico:{
  id:number
}
fecha_hora:string
paciente:{
  id:number
}
valor_consulta:number
estado:EstadoEnum
} */