import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import {ToastModule} from 'primeng/toast'
@Component({
  imports: [RouterOutlet,ToastModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  providers:[MessageService]
})
export class App {
  protected readonly title = signal('app_clinica');
}
