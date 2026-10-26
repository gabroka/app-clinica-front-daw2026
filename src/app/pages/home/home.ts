import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { DynamicDialogModule, DialogService, DynamicDialogRef, DynamicDialogConfig, DynamicDialog } from 'primeng/dynamicdialog';

//Componente principal del Home de la app. Gestiona la navegación principal 
// y provee las herramientas necesarias para la apertura de diálogos dinámicos.
@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  //Importa RouterLink para habilitar la navegación interna por rutas
  imports: [RouterLink],
  //// Registra el servicio de diálogos dinámicos
  providers:[DialogService]
})
export class HomeComponent {
  //Servicio inyectado para gestionar y abrir ventanas de diálogo
  private dialogService = inject(DialogService)
  private ref: DynamicDialogRef | null = null

  
}


