import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { MedicosClient } from '../../core/services/medicos.client';


//Componente administrativo para la gestión de honorarios médicos.
@Component({
  selector: 'app-valorconsulta',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TableModule],
  templateUrl: './valorconsulta.html',
  styleUrl: './valorconsulta.css'
})
export class ValorconsultaComponent implements OnInit {
  // Inyección de dependencias
  private readonly medicosClient = inject(MedicosClient);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  // Signals reactivos para el manejo del estado local
  medicosAdmin = signal<any[]>([]);
  cargando = signal(false);

  //Dispara la carga inicial del listado de médicos
  ngOnInit(): void {
    this.cargarMedicos();
  }

  //Obtiene desde el backend el listado completo de médicos registrados
  cargarMedicos(): void {
    this.cargando.set(true);
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

  //actualiza el valor de la consulta médica enviando la nueva tarifa al servidor
  actualizarValorConsulta(medico:any, nuevoValor: number): void {
    const idMedico = medico.id || medico.idMedico;
    const payload = { valorConsulta: nuevoValor };

    /* console.log('idMedico: ',idMedico,'payload: ',payload) */
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

  //Redirige hacia el panel principal de administración
  volverAlAdmin(): void {
    this.router.navigate(['/admin/panel']);
  }
}