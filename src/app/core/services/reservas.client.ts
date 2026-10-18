import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { TurnosModel } from "../../models/turnos.model";
import { EstadoReservaEnum } from "../../models/estado-reserva-enum";
import { ReservaModel } from "../../models/reserva.model";

@Injectable({providedIn:'root'})
export class ReservasClient{
  

  private http =inject(HttpClient)

  private readonly HORA_INICIO =8
  private readonly HORA_FIN =15
  private readonly INTERVALO =1

  getHorariosDisponibles(medicoId:number, fecha:string):Observable<string[]>{

    
    return this.http.get<ReservaModel[]>(`/api/reservas/medico/${medicoId}`,{
      params: {fecha}}).pipe(map(turnosOcupados =>this.calcularHorariosLibres(turnosOcupados)))
    }
  
  private calcularHorariosLibres(turnoOcupado:ReservaModel[]):string[]{
    const turnoNoCancelado = turnoOcupado.filter( t=> t.estado !== EstadoReservaEnum.CANCELADO)
    const horaturno = turnoNoCancelado.map(t=>t.fechaTurno)
    const horaturno1 = horaturno.map((h)=>`${h.split('T')[1].split(':00.000Z')[0]}`)
    
    const todosLosHorarios: string[] = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
      const turnosLibres = todosLosHorarios.filter(hora=>!horaturno1.includes(hora))
      
    return turnosLibres

  }
confirmaReserva(id_medico:number, id_paciente:number, fecha:string, hora:string):Observable<ReservaModel>{
const fecha_hora = `${fecha}T${hora}:00.000Z`
  return this.http.post<ReservaModel>(`/api/reservas`,{id_medico, id_paciente, fecha_hora})

}
}