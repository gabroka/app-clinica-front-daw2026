import { EstadoEnum } from "./estado-enum"
import { RolEnum } from "./rol-enum"

export interface Usuario{
  id:number
  documento:string
  apellidos:string
  nombres:string
  email:string
  estado:EstadoEnum
  rol:RolEnum
}