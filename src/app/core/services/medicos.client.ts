import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { MedicoModel} from "../../models/medico.model"
import { ActualizarMedicoResponseDto } from "../../models/actualizarMedicoResponse.dto";

@Injectable({
  providedIn: "root",
})
export class MedicosClient {
  
  

  constructor(private http: HttpClient) { }

  getMedicos(): Observable<MedicoModel[]> {
    return this.http.get<MedicoModel[]>("/api/medicos")

    

  }

actualizarMedico(id: number, data: {}): Observable<ActualizarMedicoResponseDto> {
  return this.http.patch<ActualizarMedicoResponseDto>(`/api/medicos/${id}/valor-consulta`, data);
}}
