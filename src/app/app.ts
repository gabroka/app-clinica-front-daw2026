import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import {ToastModule} from 'primeng/toast'
import { HeaderComponent } from './pages/header/header';

//Componente raíz de la app
@Component({
  imports: [RouterOutlet,ToastModule, HeaderComponent,],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  //Registra el servicio de mensajes a nivel global para habilitar alertas 
  // y notificaciones toast
  providers:[MessageService]
})
export class App {
  //Signal reactivo que almacena el título identificador de la aplicación
  protected readonly title = signal('app_clinica');
}
