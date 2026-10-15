import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { turnos } from "../../models/turnos.model";
import { EstadoEnum } from "../../models/estado-enum";
import { Reserva } from "../../models/reserva.model";

@Injectable({providedIn:'root'})
export class ReservasService{
  

  private http =inject(HttpClient)

  private readonly HORA_INICIO =8
  private readonly HORA_FIN =15
  private readonly INTERVALO =1

  getHorariosDisponibles(medicoId:number, fecha:string):Observable<string[]>{

    
    return this.http.get<turnos[]>(`/api/reservas/medico/${medicoId}`,{
      params: {fecha}}).pipe(map(turnosOcupados =>this.calcularHorariosLibres(turnosOcupados)))
    }
  
  private calcularHorariosLibres(turnoOcupado:turnos[]):string[]{
    const turnoNoCancelado = turnoOcupado.filter( t=> t.estado !== EstadoEnum.CANCELADO)
    const horaturno = turnoNoCancelado.map(t=>t.fecha_hora)
    const horaturno1 = horaturno.map((h)=>`${h.split('T')[1].split(':00.000Z')[0]}`)
    
    const todosLosHorarios: string[] = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
      const turnosLibres = todosLosHorarios.filter(hora=>!horaturno1.includes(hora))
      
    return turnosLibres

  }
confirmaReserva(id_medico:number, id_paciente:number, fecha:string, hora:string):Observable<Reserva>{
const fecha_hora = `${fecha}T${hora}:00.000Z`
  return this.http.post<Reserva>(`/api/reservas`,{id_medico, id_paciente, fecha_hora})

}
}