import { EstadoUsuarioEnum } from "./estado-usuario-enum"
import { RolEnum } from "./rol-enum"

export interface UsuarioModel{
  id:number
  documento:string
  apellidos:string
  nombres:string
  email:string
  estado:EstadoUsuarioEnum
  rol:RolEnum
}