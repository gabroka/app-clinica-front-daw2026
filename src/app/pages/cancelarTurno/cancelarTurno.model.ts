// Interfaz que define la estructura de datos utilizada para la identificación y 
// gestión de la cancelación de un turno médico 
export interface CancelarTurnoModel {
  idReserva: number
  idMedico: number,
  idPaciente: number,
  fecha: string
}