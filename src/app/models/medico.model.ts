/* lo que me devuelve la ruta /api/medicos */
export interface MedicoModel {
  idMedico: number
  idUsuario: number
  nombre: string
  apellido: string
  mp: number
  valorConsulta: number
}