import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TurnosModel } from "../../models/turnos.model";


@Injectable({providedIn:"root"})
export class TurnosClient{
  private http=inject(HttpClient)

  getTurnos(id:number):Observable<TurnosModel[]>{
    return this.http.get<TurnosModel[]>(`api/reservas/paciente/${id}`)
  }
}