import { EstadoEnum } from "./estado-enum"


export interface Reserva {
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
}