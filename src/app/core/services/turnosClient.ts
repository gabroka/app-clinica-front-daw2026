import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TurnosModel } from "../../models/turnos.model";

// Define la clase como un servicio inyectable
@Injectable({providedIn:"root"})
export class TurnosClient{

  // Inyección de dependencias
  private http=inject(HttpClient)
  
  // Obtiene la lista de turnos o reservas asociados a un paciente específico según su identificador.
  getTurnos(id:number):Observable<TurnosModel[]>{
    return this.http.get<TurnosModel[]>(`api/reservas/paciente/${id}`)
  }
}