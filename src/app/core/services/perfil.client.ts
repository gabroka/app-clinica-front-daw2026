import { HttpClient } from "@angular/common/http"
import { inject, Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { Usuario } from "../../models/usuario.model"



@Injectable({providedIn:'root'})
export class Perfil{
  private http =inject(HttpClient)  
  getPerfil():Observable<Usuario>{
    return this.http.get<Usuario>(`/api/auth/perfil`)
  }
}