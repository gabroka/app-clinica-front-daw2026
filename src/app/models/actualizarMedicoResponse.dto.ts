
// Interfaz DTO que define la estructura de la respuesta obtenida 
// al actualizar exitosamente la información de un médico en el sistema.

export interface ActualizarMedicoResponseDto{

  idMedico: number
    idUsuario: number
    nombre: string
    apellido: string
    matricula: number
    nuevoValorConsulta: number
}