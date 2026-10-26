import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";


// Define el componente (plantilla visual y diseño general para el flujo de autenticación)
@Component({
  selector: 'app-authLayout',
  templateUrl: './authLayout.html',
  //Importa RouterOutlet para permitir la renderización dinámica de las subrutas hijas dentro de este layout
  imports: [RouterOutlet]
})
export class AuthLayoutComponent {

}