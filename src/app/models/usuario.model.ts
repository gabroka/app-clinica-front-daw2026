import { EstadoUsuarioEnum } from "./estado-usuario-enum"
import { RolEnum } from "./rol-enum"

//Interfaz que define la estructura de datos de un usuario registrado en el sistema
export interface UsuarioModel{
  id:number
  documento:string
  apellidos:string
  nombres:string
  email:string
  estado:EstadoUsuarioEnum
  rol:RolEnum
}