import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog'; // <--- Importante para el modal
import { MessageService } from 'primeng/api';
import { PerfilClient } from '../../core/services/perfil.client';
import { ReservasClient } from '../../core/services/reservas.client';
import { AuthStore } from '../../auth/auth-store';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, DialogModule], // <--- Agregar DialogModule aquí
  templateUrl: './paciente.html',
  styleUrl: './paciente.css'
})
export class PacienteComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly perfilClient = inject(PerfilClient);
  private readonly reservasClient = inject(ReservasClient);
  private readonly messageService = inject(MessageService);
  private readonly authStore = inject(AuthStore);

  turnosPaciente = signal<any[]>([]);
  cargando = signal(false);
  
  // 🌟 Controla la visibilidad de la ventana modal
  verModalCancelar = signal(false);

  ngOnInit(): void {
    this.cargarTurnosPaciente();
  }

  cargarTurnosPaciente(): void {
    this.cargando.set(true);
    this.perfilClient.getPerfil().subscribe({
      next: (usuario: any) => {
        const idUsuario = usuario.id; 
        if (idUsuario) {
          this.reservasClient.listarTurnosPaciente(idUsuario).subscribe({
            next: (turnos) => {
              this.turnosPaciente.set(turnos || []);
              this.cargando.set(false);
            },
            error: (err) => {
              console.error('Error al obtener turnos del paciente:', err);
              this.cargando.set(false);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar tus turnos.' });
            }
          });
        } else {
          this.cargando.set(false);
        }
      },
      error: (err) => {
        console.error('Error al obtener perfil:', err);
        this.cargando.set(false);
      }
    });
  }

  irSolicitarTurno(): void {
    this.router.navigate(['/turnos']);
  }

  // 🌟 Métodos para abrir y cerrar el modal
  abrirModalCancelar(): void {
    this.verModalCancelar.set(true);
  }

  cerrarModalCancelar(): void {
    this.verModalCancelar.set(false);
  }

  cancelarTurno(reserva: any): void {
    const fechaHoraTurno = new Date(reserva.fechaTurno || reserva.fecha_hora);
    const ahora = new Date();

    if (ahora >= fechaHoraTurno) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No se puede cancelar',
        detail: 'El turno ya ha iniciado o expirado.'
      });
      return;
    }

    if (confirm('¿Estás seguro de que deseas cancelar este turno?')) {
      const idReserva = reserva.idReserva || reserva.id;
      this.perfilClient.getPerfil().subscribe({
        next: (usuario: any) => {
          const idUsuario = usuario.id;
          this.reservasClient.cancelarReservaPaciente(idReserva, idUsuario).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Turno cancelado correctamente.' });
              this.cargarTurnosPaciente();
              this.cerrarModalCancelar(); // Cierra el modal tras cancelar con éxito
            },
            error: (err) => {
              console.error('Error al cancelar reserva:', err);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cancelar la reserva.' });
            }
          });
        }
      });
    }
  }

  cerrarSesion(): void {
    this.authStore.cerrarSesion();
  }
}