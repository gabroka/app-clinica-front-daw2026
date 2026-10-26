import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ReservasClient } from '../../core/services/reservas.client';
import { MedicosClient } from '../../core/services/medicos.client';
import { AuthStore } from '../../auth/auth-store';
import { forkJoin } from 'rxjs';

//Componente principal del panel de administración
//Permite visualizar y gestionar reservas, consultar médicos y administrar valores de consulta
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TableModule], 
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent implements OnInit {

  // Inyección de dependencias
  private readonly reservasClient = inject(ReservasClient);
  private readonly medicosClient = inject(MedicosClient);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  // Signals reactivos para gestionar el estado local del componente
  reservasAdmin = signal<any[]>([]);
  medicosAdmin = signal<any[]>([]); 
  cargando = signal(false);

  //Dispara la carga inicial de datos
  ngOnInit(): void {
    this.cargarDatos();
  }

  //* Carga simultáneamente el listado de reservas y médicos desde el backend
  cargarDatos(): void {
    this.cargando.set(true);

    forkJoin({
      reservas: this.reservasClient.listarTodasLasReservas(),
      medicos: this.medicosClient.getMedicos()
    }).subscribe({
      next: ({ reservas, medicos }) => {
        // Guarda la lista de médicos 
        this.medicosAdmin.set(medicos || []);

        // Mapa de médicos para búsqueda rápida por ID en reservas
        const medicosMap = new Map();
        (medicos || []).forEach((m: any) => {
          const id = m.id || m.idMedico;
          medicosMap.set(id, m);
        });

        // Mapeo de reservas 
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

  //Navega hacia la vista de gestión de honorarios
irAGestionHonorarios(): void {
  this.router.navigate(['/pages/valorconsulta']); 
}

  //Actualiza el valor de la consulta médica para un profesional
  actualizarValorConsulta(medico: any, nuevoValor: number): void {
    // 
    const id = medico.idUsuario || medico.id_usuario || medico.idMedico || medico.id;
    
    /* console.log('ID seleccionado para actualizar:', id); */
   /*  console.log('Nuevo valor ingresado:', nuevoValor); */

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
        // Recarga la tabla con los datos actualizados
        this.cargarDatos(); 
      },
      error: (err) => {
        /* console.error('Error detallado al actualizar médico:', err); */
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el valor en el servidor.' });
      }
    });
  }
  //Navega hacia la vista de reserva de turnos
  irReservarTurno(): void {
    this.router.navigate(['/turnos']);
  }

//Permite al administrador cancelar un turno 
cancelarTurnoAdmin(reserva: any): void {
  const fechaHoraTurno = new Date(reserva.fechaTurno || reserva.fecha_hora);
  const ahora = new Date();

  // Valida si el turno ya pasó o inició
  if (ahora >= fechaHoraTurno) {
    this.messageService.add({
      severity: 'warn',
      summary: 'No se puede cancelar',
      detail: 'El turno ya ha iniciado o expirado.'
    });
    return;
  }

  const idReserva = reserva.idReserva || reserva.id;

  if (confirm('¿Estás seguro de que deseas cancelar este turno?')) {
    this.reservasClient.cancelarReservaAdmin(idReserva).subscribe({
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Turno cancelado correctamente.' 
        });
        // Refresca la tabla automáticamente
        this.cargarDatos();
      },
      error: (err) => {
        /* console.error('Error al cancelar reserva:', err); */
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: err.error?.message || 'No se pudo cancelar la reserva.' 
        });
      }
    });
  }
}

  //Cierra la sesión activa del administrador y redirige al login 
  cerrarSesion(): void {
    this.authStore.cerrarSesion();
  }
}