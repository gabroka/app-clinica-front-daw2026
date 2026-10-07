import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { apiURL } from "./apiURL";
import { turnos } from "../../models/turnos.model";

@Injectable({providedIn:'root'})
export class ReservasService{
  

  private http =inject(HttpClient)

  private readonly HORA_INICIO =8
  private readonly HORA_FIN =15
  private readonly INTERVALO =1

  getHorariosDisponibles(medicoId:number, fecha:string):Observable<string[]>{

    /* const turnosOcupados = this.http.get<turnos[]>(`${apiURL}reservas/medico/${medicoId}`,{
      params: {fecha}})
      const listaTurnosOcupados = turnosOcupados.map(t=>t.fecha_hora)
 */
    return this.http.get<turnos[]>(`${apiURL}reservas/medico/${medicoId}`,{
      params: {fecha}}).pipe(map(turnosOcupados =>this.calcularHorariosLibres(turnosOcupados)))
    }
  
  private calcularHorariosLibres(turnoOcupado:turnos[]):string[]{
    const horaturno = turnoOcupado.map(t=>t.fecha_hora)
    const todosLosHorarios: string[] = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
      const turnosLibres = todosLosHorarios.filter(hora=>!horaturno.includes(hora))
    return turnosLibres

  }

}