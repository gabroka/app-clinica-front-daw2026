import { Component } from "@angular/core";
import { HomeComponent } from "../../pages/home/home";
import { HeaderComponent } from "../../pages/header/header";
import { RouterOutlet } from "@angular/router";

//// Define el componente encargado de estructurar el diseño principal (layout) que envuelve las vistas generales de la aplicación
@Component({
  selector:'app-mainLayout',
  templateUrl:'./mainLayout.html',

  // Importa el HeaderComponent para la barra superior y RouterOutlet para la carga dinámica de vistas hija
imports: [RouterOutlet,HeaderComponent]
})

//Componente contenedor principal de la interfaz de usuario
export class MainLayoutComponent {}