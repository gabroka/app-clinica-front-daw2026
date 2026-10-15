import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class MedicosService {
  
  

  constructor(private http: HttpClient) { }

  getMedicos(): Observable<any[]> {
    return this.http.get<any[]>(`/api/medicos`)
    

  }
}