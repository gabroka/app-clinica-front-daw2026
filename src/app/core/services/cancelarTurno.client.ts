import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { RolEnum } from "../../models/rol-enum";
import { Observable } from "rxjs";


//Define la clase como un servicio inyectable
@Injectable({providedIn:'root'})
export class CancelarTurnoClient{

  // Inyección de dependencias
  private http=inject(HttpClient)

  setCancelarTurno(id:number,idPaciente:number,rol:RolEnum):Observable<any|undefined>{
    // Valida si el usuario es Administrador
    if(rol==RolEnum.ADMINISTRADOR){
      throw new Error("La cancelación de turnos para administradores no está implementada")
      // Valida si el usuario es Paciente
    }else if(rol==RolEnum.PACIENTE){

      return this.http.delete<any|undefined>(`/api/reservas/paciente/${id}/usuario/${idPaciente}`)
    }
    // Lanza un error si el rol recibido no coincide con ninguno de los esperados
    throw new Error("Rol no soportado")
  }
}
