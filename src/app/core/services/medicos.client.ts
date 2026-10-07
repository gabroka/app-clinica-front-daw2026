import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { apiURL } from "./apiURL";

@Injectable({
  providedIn: "root",
})
export class MedicosService {
  
  private apiURL = 'http://localhost:3000/api/'

  constructor(private http: HttpClient) { }

  getMedicos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}medicos`)
    /* return this.http.get<any[]>(`${apiURL}medicos`).pipe(
      tap(data => console.log("médicos desde el servicio:", data))) */
    /* const medicos = this.http.get<any[]>(`${this.apiURL}medicos`);
    console.log("medicos desde el servicio: ", medicos)
    return medicos */

  }
}