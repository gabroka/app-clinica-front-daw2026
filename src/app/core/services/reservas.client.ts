import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { EstadoReservaEnum } from "../../models/estado-reserva-enum";
import { ReservaModel } from "../../models/reserva.model";

@Injectable({ providedIn: 'root' })
export class ReservasClient {
  private http = inject(HttpClient);

  // --- RUTAS DEL MÉDICO ---
  
  // Ver agenda del médico por fecha (GET /api/reservas/medico/:idMedico?fecha=YYYY-MM-DD)
  getTurnosMedico(medicoId: number, fecha: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/reservas/medico/${medicoId}`, {
      params: { fecha }
    });
  }

  // Marcar turno como atendido o ausente (PATCH /api/reservas/medico/:id/estado)
  cambiarEstadoTurno(idReserva: number, estado: 'atendido' | 'ausente'): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`/api/reservas/medico/${idReserva}/estado`, { estado });
  }

  // --- RUTAS DEL ADMINISTRADOR ---

  // Listar todas las reservas del sistema (GET /api/reservas/admin)
  listarTodasLasReservas(): Observable<any[]> {
    return this.http.get<any[]>(`/api/reservas/admin`);
  }

  // Cancelar reserva como Admin (DELETE /api/reservas/admin/:id)
  cancelarReservaAdmin(idReserva: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`/api/reservas/admin/${idReserva}`);
  }

// Modificar el valor de la consulta del médico (PATCH o PUT según tu backend/Swagger)
  actualizarTarifaMedico(idMedico: number, valorConsulta: number): Observable<any> {
    return this.http.patch<any>(`/api/medicos/${idMedico}`, { valorConsulta });
  }

  // --- RUTAS DE PACIENTE / GENERALES ---

  // Listar turnos por paciente (GET /api/reservas/paciente/:idPaciente)
  listarTurnosPaciente(idPaciente: number): Observable<any[]> {
    return this.http.get<any[]>(`/api/reservas/paciente/${idPaciente}`);
  }

  // Cancelar reserva como Paciente (DELETE /api/reservas/paciente/:id/usuario/:idPaciente)
  cancelarReservaPaciente(idReserva: number, idPaciente: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`/api/reservas/paciente/${idReserva}/usuario/${idPaciente}`);
  }

  getHorariosDisponibles(medicoId: number, fecha: string): Observable<string[]> {
    return this.http.get<ReservaModel[]>(`/api/reservas/medico/${medicoId}`, {
      params: { fecha }
    }).pipe(
      map(turnosOcupados => this.calcularHorariosLibres(turnosOcupados))
    );
  }
  
  private calcularHorariosLibres(turnoOcupado: ReservaModel[]): string[] {
    const turnoNoCancelado = turnoOcupado.filter(t => t.estado !== EstadoReservaEnum.CANCELADO);
    const horaturno = turnoNoCancelado.map(t => t.fechaTurno);
    const horaturno1 = horaturno.map((h) => `${h.split('T')[1].split(':00.000Z')[0]}`);
    
    const todosLosHorarios: string[] = [
      '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'
    ];
    const turnosLibres = todosLosHorarios.filter(hora => !horaturno1.includes(hora));
     
    return turnosLibres;
  }

  confirmaReserva(id_medico: number, id_paciente: number, fecha: string, hora: string): Observable<ReservaModel> {
    
    const fecha_hora = `${fecha}T${hora}`;//el back guada las horas en formato utc, al guardar corre la hora segun el uso horario de argentina
    return this.http.post<ReservaModel>(`/api/reservas`, { id_medico, id_paciente, fecha_hora });
  }
}