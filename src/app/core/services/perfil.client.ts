import { HttpClient } from "@angular/common/http"
import { inject, Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { UsuarioModel } from "../../models/usuario.model"



@Injectable({providedIn:'root'})
export class PerfilClient{
  private http =inject(HttpClient)  
  getPerfil():Observable<UsuarioModel>{
    return this.http.get<UsuarioModel>(`/api/auth/perfil`)
  }
}