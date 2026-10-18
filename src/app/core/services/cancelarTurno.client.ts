import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { RolEnum } from "../../models/rol-enum";
import { Observable } from "rxjs";



@Injectable({providedIn:'root'})
export class CancelarTurnoClient{
  private http=inject(HttpClient)

  setCancelarTurno(id:number,idPaciente:number,rol:RolEnum):Observable<any|undefined>{
    if(rol==RolEnum.ADMINISTRADOR){
      throw new Error("La cancelación de turnos para administradores no está implementada")
    }else if(rol==RolEnum.PACIENTE){

      return this.http.delete<any|undefined>(`/api/reservas/paciente/${id}/usuario/${idPaciente}`)
    }
    throw new Error("Rol no soportado")
  }
}
