/* import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DynamicDialogModule, DialogService, DynamicDialogRef, DynamicDialogConfig, DynamicDialog } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { CancelarTurnoModel } from './cancelarTurno.model';
import { TurnosClient } from '../../core/services/turnosClient';
import { PerfilClient } from '../../core/services/perfil.client';
import { EstadoReservaEnum } from '../../models/estado-reserva-enum';
import { RolEnum } from '../../models/rol-enum';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { UsuarioModel } from '../../models/usuario.model';
import { TurnosModel } from '../../models/turnos.model';
import { CancelarTurnoClient } from '../../core/services/cancelarTurno.client';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MedicosClient } from '../../core/services/medicos.client';
import { MedicoModel } from '../../models/medico.model';
import { signal } from "@angular/core";

@Component({
  templateUrl: './cancelarTurno.html',
  standalone: true,
  imports: [ButtonModule, ToastModule, TableModule, ConfirmPopupModule, ConfirmDialogModule],
  providers: [DialogService, MessageService, ConfirmationService]
})
export class CancelarTurnoComponent implements OnInit {
  private ref = inject(DynamicDialogRef);        // Para cerrarse
  private config = inject(DynamicDialogConfig); // Para leer datos del padre
  private dialogService = inject(DialogService)
  private turnosClient = inject(TurnosClient)
  private perfilClient = inject(PerfilClient)
  private cdr = inject(ChangeDetectorRef);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private cancelarTurnoClient = inject(CancelarTurnoClient)
  private medicosClient = inject(MedicosClient)

  
  private medicos: MedicoModel[] = []
  private usuario: any
  protected turnos: any[] = []
  instance: DynamicDialog | undefined = undefined;
  
  constructor() {}

  ngOnInit(): void {
    this.buscarMedicos()
    this.buscarTurnos()
  }

  buscarMedicos() {
    this.medicosClient.getMedicos().subscribe({
      next: (datos: MedicoModel[]) => {
        this.medicos = datos;
      },
      error: (err) => console.error("Error al traer médicos:", err)
    })
  }

  cancelarTurno(event: Event, turno: any) {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: `¿Estás seguro de cancelar el turno del día ${turno.fecha}?`,
      icon: 'pi pi-info-circle',
      acceptLabel: 'Sí, cancelar',
      rejectIcon: 'pi pi-times',
      acceptIcon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'error',
      },
      accept: () => {
        console.log('estamos en aceptar del evento cancelar turno')
        const idTurno = turno.idTurno
        const idPaciente = turno.idPaciente
        const rol = this.usuario.rol

        this.cancelarTurnoClient.setCancelarTurno(idTurno, idPaciente, rol).subscribe({
          next: (data) => {
            this.messageService.add({ severity: 'success', summary: `${data.mensaje}`, life: 5000 })
            
            // Eliminamos el turno de la tabla localmente de forma instantánea
            this.turnos = this.turnos.filter(t => t.idTurno !== idTurno);
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: `el turno ${idTurno} no se ha cancelado`, detail: `${err.error.message}`, life: 5000 })
            console.log(err)
          }
        })
      },
      reject: () => {
        console.log('estamos en el cancelar del evento cancelar turno')
      }
    });
  }

  private convertirFecha(fechaLatina: string): Date {
    const [soloFecha, soloHora] = fechaLatina.split(', ');
    const [dia, mes, anio] = soloFecha.split('/');
    const fechaArreglada = `${anio}/${mes}/${dia} ${soloHora}`;
    return new Date(fechaArreglada);
  }

  buscarTurnos() {
    /* obtiene los datos del usuario logueado */
    /*this.perfilClient.getPerfil().subscribe({
      next: (data: any) => {
        this.usuario = data
        const idUsuario = data.id || data.idUsuario || data.userId;

        if (!idUsuario) {
          console.error('No se pudo encontrar el ID del usuario:', data);
          return;
        }

        if (data.rol == RolEnum.PACIENTE || (data.rol == RolEnum.ADMINISTRADOR && !this.config.data)) {
          /* si esta logueado un paciente se obtienen sus turnos */
         /* this.turnosClient.getTurnos(idUsuario).subscribe({
            next: (turnosData: TurnosModel[]) => {
              const hoy = new Date()
              /* se eliminan los turnos viejos y los que no son activos */
           /*   const turnosActivos = turnosData.filter(t => {
                const fechaDelTurno = this.convertirFecha(t.fechaTurno);
                return fechaDelTurno >= hoy && t.estado === EstadoReservaEnum.ACTIVO
              })
              
              this.turnos = turnosActivos.map((t: TurnosModel) => {
                return {
                  idTurno: t.idReserva,
                  medico: `${t.nombreMedico} ${t.apellidoMedico}`,
                  paciente: `${this.usuario.nombres} ${this.usuario.apellidos}`,
                  idPaciente: idUsuario,
                  fecha: `${t.fechaTurno}`
                }
              })
              this.cdr.detectChanges();

            },
            error: (err: any) => console.log(err)
          })
        } else if (data.rol == RolEnum.ADMINISTRADOR && this.config.data) {
          const idPacienteSeleccionado = typeof this.config.data === 'object' ? this.config.data.id : this.config.data;
          const nombrePacienteStr = typeof this.config.data === 'object' 
            ? `${this.config.data.nombres} ${this.config.data.apellidos}` 
            : `Paciente ID: ${idPacienteSeleccionado}`;

          this.turnosClient.getTurnos(idPacienteSeleccionado).subscribe({
            next: (turnosData: TurnosModel[]) => {
              this.turnos = turnosData.map((t: TurnosModel) => {
                return {
                  idTurno: t.idReserva,
                  medico: `${t.nombreMedico} ${t.apellidoMedico}`,
                  paciente: nombrePacienteStr,
                  idPaciente: idPacienteSeleccionado,
                  fecha: `${t.fechaTurno}`
                }
              })
              this.cdr.detectChanges();

            },
            error: (err: any) => console.log(err)
          })
        }

      },
      error: (err) => console.log(err)
    })
  }

  /* funcion que cierra la ventana de dialogo dinamica de primeng */
  /*closeDialog() {
    this.ref.close();
  }
} */