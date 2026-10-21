import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { MedicoModel} from "../../models/medico.model"

@Injectable({
  providedIn: "root",
})
export class MedicosClient {
  
  

  constructor(private http: HttpClient) { }

  getMedicos(): Observable<MedicoModel[]> {
    return this.http.get<MedicoModel[]>("/api/medicos")

    

  }

actualizarMedico(id: number, data: any): Observable<any> {
  return this.http.put<any>(`/api/medico/${id}`, data);
}}
