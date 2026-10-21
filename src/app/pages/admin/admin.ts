import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- Importante para [(ngModel)]
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ReservasClient } from '../../core/services/reservas.client';
import { MedicosClient } from '../../core/services/medicos.client';
import { AuthStore } from '../../auth/auth-store';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TableModule], // <--- Asegúrate de incluir FormsModule aquí
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent implements OnInit {
  private readonly reservasClient = inject(ReservasClient);
  private readonly medicosClient = inject(MedicosClient);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  reservasAdmin = signal<any[]>([]);
  medicosAdmin = signal<any[]>([]); // <--- Declaramos la señal aquí para que la reconozca el HTML
  cargando = signal(false);

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);

    forkJoin({
      reservas: this.reservasClient.listarTodasLasReservas(),
      medicos: this.medicosClient.getMedicos()
    }).subscribe({
      next: ({ reservas, medicos }) => {
        // 1. Guardamos la lista de médicos en su señal respectiva
        this.medicosAdmin.set(medicos || []);

        // Mapa de médicos para búsqueda rápida por ID en reservas
        const medicosMap = new Map();
        (medicos || []).forEach((m: any) => {
          const id = m.id || m.idMedico;
          medicosMap.set(id, m);
        });

        // 2. Mapeo de reservas (con tu lógica existente)
        const reservasMapeadas = (reservas || []).map((r: any) => {
          let fechaFormateada = r.fecha_hora || r.fechaTurno;
          if (fechaFormateada) {
            try {
              fechaFormateada = new Date(fechaFormateada).toLocaleString('es-AR', {
                timeZone: 'America/Argentina/Buenos_Aires',
                hour12: false,
              });
            } catch (e) {}
          }

          const idMedicoReserva = r.id_medico || r.medicoId || r.medico?.id;
          const medicoEncontrado = medicosMap.get(idMedicoReserva) || r.medico;

          return {
            ...r,
            idReserva: r.id || r.idReserva,
            fechaTurno: fechaFormateada,
            nombreMedico: medicoEncontrado?.nombres || medicoEncontrado?.usuario?.nombres || medicoEncontrado?.nombre || 'N/D',
            apellidoMedico: medicoEncontrado?.apellidos || medicoEncontrado?.usuario?.apellidos || medicoEncontrado?.apellido || '',
            nombresPaciente: r.paciente?.nombres || r.paciente?.usuario?.nombres || r.nombresPaciente || 'N/D',
            apellidosPaciente: r.paciente?.apellidos || r.paciente?.usuario?.apellidos || r.apellidosPaciente || ''
          };
        });

        this.reservasAdmin.set(reservasMapeadas);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar datos del administrador:', err);
        this.cargando.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos.' });
      }
    });
  }

  actualizarValorConsulta(medico: any, nuevoValor: number): void {
    // Priorizamos idUsuario (que es 2 para Carlos Fernández) en lugar de idMedico
    const id = medico.idUsuario || medico.id_usuario || medico.idMedico || medico.id;
    
    console.log('ID seleccionado para actualizar:', id);
    console.log('Nuevo valor ingresado:', nuevoValor);

    if (!id) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'No se pudo identificar el ID del médico.' 
      });
      return;
    }

    const datosActualizados = { 
      ...medico, 
      valor_consulta: Number(nuevoValor),
      valorConsulta: Number(nuevoValor) 
    };

    this.medicosClient.actualizarMedico(id, datosActualizados).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Valor de consulta actualizado correctamente.' });
        this.cargarDatos(); // Recarga la tabla con los datos actualizados
      },
      error: (err) => {
        console.error('Error detallado al actualizar médico:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el valor en el servidor.' });
      }
    });
  }
  irReservarTurno(): void {
    this.router.navigate(['/turnos']);
  }

  cancelarTurnoAdmin(reserva: any): void {
    // Lógica de cancelación existente...
  }

  cerrarSesion(): void {
    this.authStore.cerrarSesion();
  }
}