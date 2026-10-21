import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import {ToastModule} from 'primeng/toast'
import { HeaderComponent } from './pages/header/header';
@Component({
  imports: [RouterOutlet,ToastModule, HeaderComponent,],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  providers:[MessageService]
})
export class App {
  protected readonly title = signal('app_clinica');
}
