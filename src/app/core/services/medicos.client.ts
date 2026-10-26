import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { MedicoModel} from "../../models/medico.model"
import { ActualizarMedicoResponseDto } from "../../models/actualizarMedicoResponse.dto";

// Define la clase como un servicio inyectable
@Injectable({
  providedIn: "root",
})
export class MedicosClient {  
  
  // Inyección de dependencias
  constructor(private http: HttpClient) { }
  
  //Obtiene la lista completa de médicos desde el servidor backend
  getMedicos(): Observable<MedicoModel[]> {
    return this.http.get<MedicoModel[]>("/api/medicos")   
  }

//Actualiza información específica de un médico, el valor de consulta
actualizarMedico(id: number, data: {}): Observable<ActualizarMedicoResponseDto> {
  return this.http.patch<ActualizarMedicoResponseDto>(`/api/medicos/${id}/valor-consulta`, data);
}}
