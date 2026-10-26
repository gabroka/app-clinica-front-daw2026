import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { AuthStore } from '../../auth/auth-store';
import { ReservasClient } from '../../core/services/reservas.client';
import { PerfilClient } from '../../core/services/perfil.client';
import { TurnosMedicoModel } from '../../models/turnosMedico.model';
import { MedicosClient } from '../../core/services/medicos.client';
import { MedicoModel } from '../../models/medico.model';
import { UsuarioModel } from '../../models/usuario.model';

//Componente del panel del médico. Permite visualizar la agenda 
// de turnos filtrada por fecha, gestionar el estado de atención de los pacientes
@Component({
  selector: 'app-medico',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TableModule, CardModule],
  templateUrl: './medico.html',
  styleUrl: './medico.css'
})
export class MedicoComponent implements OnInit {

  //// Inyección de dependencias
  private readonly authStore = inject(AuthStore);
  private readonly reservasClient = inject(ReservasClient);
  private readonly perfilClient = inject(PerfilClient);
  private readonly messageService = inject(MessageService);
  private readonly medicos = inject(MedicosClient)
  //// Signals reactivos para el manejo de estados locales
  agendaTurnos = signal<any[]>([]);
  cargando = signal(false);

  //Identificador único del médico logueado en el sistema
  idMedico: number | null = null;
  protected medico = signal<MedicoModel[]> ([])
  // Probar con la fecha donde están registrados los turnos activos en la BD
  fechaConsulta: string = new Date().toISOString().slice(0, 10);

  //Dispara la carga inicial del perfil del medico y su agenda asociada
  ngOnInit(): void {
    this.cargarPerfilYAgenda();
  }

  //Obtiene el perfil del usuario autenticado, mapea el identificador correspondiente 
  //al médico y solicita la agenda de turnos inicial. 
  cargarPerfilYAgenda(): void {
    this.cargando.set(true);

    this.perfilClient.getPerfil().subscribe({
      next: (perfil: UsuarioModel) => {
        /* console.log('Perfil obtenido:', perfil); */

        // Mapeamos el ID de usuario al ID de la entidad médico correspondiente
        /* this.idMedico = perfil.id === 2 ? 1 : (perfil.idMedico || perfil.id); */
        this.medicos.getMedicos().subscribe({
          next: (medicos: MedicoModel[]) => {
            /* console.log('ID de Médico mapeado para la consulta:', medicos); */
            this.medico.set(medicos.filter(m => m.idUsuario == perfil.id))  
           /*  console.log('medico: ', this.medico()) */
            this.idMedico = this.medico()[0].idMedico
            if (this.idMedico) {
              this.obtenerAgenda(this.idMedico, this.fechaConsulta);
            } else {
              this.cargando.set(false);
            }
          },
          error: (error) => console.log('error al obtener el medico logueado',error)
        })


      },
      error: (err: any) => {
        console.error('Error al obtener perfil del médico:', err);
        this.cargando.set(false);
      }
    });
  }

  marcarEstado(idReserva: number, nuevoEstado: 'atendido' | 'ausente'): void {
    this.reservasClient.cambiarEstadoTurno(idReserva, nuevoEstado).subscribe({
      next: (resp: { mensaje: string }) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Estado del turno actualizado' });
        if (this.idMedico) {
          this.obtenerAgenda(this.idMedico, this.fechaConsulta);
        }
      },
      error: (err: any) => {
        console.error('Error al cambiar el estado del turno:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado' });
      }
    });
  }

  //Consulta y carga la lista de turnos agendados para un médico y fecha determinada,
  //formateando las fechas para su correcta visualización.
  obtenerAgenda(idMedico: number, fecha: string): void {
    this.cargando.set(true);
    /* console.log('Consultando turnos para idMedico:', idMedico, 'Fecha:', fecha); */

    this.reservasClient.getTurnosMedico(idMedico, fecha).subscribe({
      next: (turnos: TurnosMedicoModel[]) => {
        /* console.log('Turnos recibidos:', turnos); */

        // Mapeamos los turnos para formatear la fecha y hora de forma legible
        const turnosMapeados = (turnos || []).map((t: any) => {
          let fechaFormateada = t.fechaTurno || t.fecha_hora;
          if (fechaFormateada) {
            try {
              fechaFormateada = new Date(fechaFormateada).toISOString()
              fechaFormateada = `${fechaFormateada.split('T')[0]} ${fechaFormateada.split('T')[1].slice(0, 5)}`
            } catch (e) { }
          }

          return {
            ...t,
            idReserva: t.idRreserva || t.idReserva || t.id, // Cubre posibles variantes del backend
            fechaTurno: fechaFormateada
          };
        });

        this.agendaTurnos.set(turnosMapeados);
        this.cargando.set(false);
      },
      error: (err: any) => {
        console.error('Error al cargar la agenda médica:', err);
        this.agendaTurnos.set([]);
        this.cargando.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error al cargar la agenda de turnos.' });
      }
    });
  }

  // Maneja el evento de cambio de fecha en el selector y recarga la agenda médica.
  onFechaChange(nuevaFecha: string): void {
    this.fechaConsulta = nuevaFecha;
    if (this.idMedico) {
      this.obtenerAgenda(this.idMedico, this.fechaConsulta);
    }
  }

  //Cierra la sesión activa del profesional médico y redirige al login /
  cerrarSesion(): void {
    this.authStore.cerrarSesion();
  }
}