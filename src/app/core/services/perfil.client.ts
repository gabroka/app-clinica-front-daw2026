import { HttpClient } from "@angular/common/http"
import { inject, Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { UsuarioModel } from "../../models/usuario.model"

// Define la clase como un servicio inyectable
@Injectable({providedIn:'root'})
export class PerfilClient{

  // Inyección de dependencias
  private http =inject(HttpClient)  

  // Obtiene la información del perfil del usuario autenticado 
  getPerfil():Observable<UsuarioModel>{
    return this.http.get<UsuarioModel>(`/api/auth/perfil`)
  }

  // Obtiene la lista de perfiles de pacientes activos desde el servidor
getPerfilPacientesActivos():Observable<UsuarioModel[]>{
  return this.http.get<UsuarioModel[]>(`/api/usuarios/pacientes`)
}

}