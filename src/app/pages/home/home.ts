import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";



@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  //Importa RouterLink para habilitar la navegación interna por rutas
  imports: [RouterLink],
  
  providers:[]
})
export class HomeComponent {
  

  
}


