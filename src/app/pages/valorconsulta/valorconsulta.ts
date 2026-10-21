import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { MedicosClient } from '../../core/services/medicos.client';

@Component({
  selector: 'app-valorconsulta',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TableModule],
  templateUrl: './valorconsulta.html',
  styleUrl: './valorconsulta.css'
})
export class ValorconsultaComponent implements OnInit {
  private readonly medicosClient = inject(MedicosClient);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  medicosAdmin = signal<any[]>([]);
  cargando = signal(false);

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos(): void {
    this.cargando.set(true);
    // 🌟 Usamos getMedicos() que es el método real de tu servicio
    this.medicosClient.getMedicos().subscribe({
      next: (medicos: any[]) => {
        this.medicosAdmin.set(medicos || []);
        this.cargando.set(false);
      },
      error: (err: any) => {
        console.error('Error al cargar médicos:', err);
        this.cargando.set(false);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'No se pudieron cargar los médicos.' 
        });
      }
    });
  }

  actualizarValorConsulta(medico: any, nuevoValor: number): void {
    const idMedico = medico.id || medico.idMedico;
    const payload = { valor_consulta: nuevoValor };

    // 🌟 Usamos actualizarMedico() que es el método real de tu servicio
    this.medicosClient.actualizarMedico(idMedico, payload).subscribe({
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Valor de consulta actualizado correctamente.' 
        });
        this.cargarMedicos();
      },
      error: (err: any) => {
        console.error('Error al actualizar valor:', err);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'No se pudo actualizar el honorario.' 
        });
      }
    });
  }

  volverAlAdmin(): void {
    this.router.navigate(['/admin/panel']);
  }
}