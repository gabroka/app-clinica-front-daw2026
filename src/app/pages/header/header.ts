import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterLink } from "@angular/router";

//Componente de cabecera de la app.  Gestiona la visualización general del encabezado
// y verifica el estado de autenticación del usuario mediante sessionStorage.
@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  //Importa RouterLink para habilitar la navegación interna por rutas
  imports: [RouterLink]
})
export class HeaderComponent implements OnInit {
  //Signal reactivo que almacena y actualiza el estado de autenticación del usuario
  protected isAutenticated = signal(false);
  //Comprueba si existe un token de acceso almacenado en la sesión del navegador
  ngOnInit(): void {
    this.isAutenticated.set(sessionStorage.getItem('accessToken') !== null);

  }

}