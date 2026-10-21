import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
  private ref = inject(DynamicDialogRef);       // Para cerrarse
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
  constructor() {
    /* this.instance = this.dialogService.getInstance(this.ref) */;
    /* this.datos = this.config.data */
  }

  ngOnInit(): void {
    this.buscarMedicos()
    this.buscarTurnos()
  console.log(this.config.data['property'])


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
        /* console.log('idTurno: ', idTurno, ' idPaciente: ', idPaciente, ' rol: ', rol) */
        this.cancelarTurnoClient.setCancelarTurno(idTurno, idPaciente, rol).subscribe({
          next: (data) => {
            /* console.log('data del setcancelarturno: ', data) */
            this.messageService.add({ severity: 'success', summary: `${data.mensaje}`, life: 5000 })
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: `el turno ${idTurno} no se ha cancelado`, detail: `${err.error.message}`, life: 5000 })
            console.log(err)
          }
        })
        /* this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 }); */
      },
      reject: () => {
        console.log('estamos en el cancelar del evento cancelar turno')
        /* this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 }); */
      }
    });
  }

  private convertirFecha(fecha: string): Date {

    const [soloFecha, soloHora] = fecha.split(', ');
    const [dia, mes, anio] = soloFecha.split('/');
    const fechaArreglada = `${anio}/${mes}/${dia} ${soloHora}`;
    return new Date(fechaArreglada);
  }

  buscarTurnos() {
    /* obtiene los datos del usuario logueado */
    this.perfilClient.getPerfil().subscribe({
      next: (data: UsuarioModel) => {
        this.usuario = data

        if (data.rol == RolEnum.PACIENTE) {
          /* si esta logueado un paciente se obtienen sus turnos */
          
          this.turnosClient.getTurnos(data.id).subscribe({
            next: (data: TurnosModel[]) => {
              const hoy = new Date()
              /* se eliminan los turnos viejos y los que no son activos */
              const turnosActivos = data.filter(t => {
                const fechaDelTurno = this.convertirFecha(t.fechaTurno);
                return fechaDelTurno >= hoy && t.estado === EstadoReservaEnum.ACTIVO
              })
              
             /*  console.log('turnos activos: ', turnosActivos) */
              this.turnos = turnosActivos.map((t: TurnosModel) => {
                return {
                  idTurno: t.idReserva,
                  medico: `${t.nombreMedico} ${t.apellidoMedico}`,
                  paciente: `${this.usuario.nombres} ${this.usuario.apellidos}`,
                  idPaciente: this.usuario.id,
                  fecha: `${t.fechaTurno}`,
                  btnCancelar:this.config.data['property']
                }
              })
              this.cdr.detectChanges();

            },
            error: (err: any) => console.log(err)
          })
        } else if (data.rol == RolEnum.ADMINISTRADOR) {
          const idPaciente = this.config.data//del administrador vendra el id del paciente que haya elegino
          this.turnosClient.getTurnos(idPaciente).subscribe({
            next: (data: TurnosModel[]) => {
              /* const turnosActivos = data.filter(t => t.estado == EstadoReservaEnum.ACTIVO) */

              this.turnos = data.map((t: TurnosModel) => {
                /* console.log('valor t dentro del map ', t) */
                return {
                  id: t.idReserva,
                  medico: `${t.nombreMedico} ${t.apellidoMedico}`,
                  paciente: `${idPaciente.nombres} ${idPaciente.apellidos}`,
                  fecha: `${t.fechaTurno}`,
                  btnCancelar:this.config.data['property']
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
  closeDialog() {
    this.ref.close();
  }
}