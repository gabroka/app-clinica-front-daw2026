import { Component, inject, OnInit, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { ReservasClient } from "../../core/services/reservas.client";
import { MedicosClient } from "../../core/services/medicos.client";
import { PerfilClient } from "../../core/services/perfil.client";
import { MedicoModel } from "../../models/medico.model";
import { CancelarTurnoComponent } from "../cancelarTurno/cancelarTurno";
import { Router } from '@angular/router';
import { RolEnum } from "../../models/rol-enum";
import { UsuarioModel } from '../../models/usuario.model'
@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.html',
  styleUrl: './turnos.css',
  imports: [ReactiveFormsModule],
  providers: [DialogService]
})
export class TurnosComponent implements OnInit {

  fechaMin: string = '';
  fechaMax: string = '';
  medicos = signal<MedicoModel[]>([]);
  protected idPaciente: number = 0;
  protected paciente = signal<UsuarioModel[]>([])
  protected rol = signal<boolean>(false)

  form: FormGroup = new FormGroup({
    nombre: new FormControl({ value: '', disabled: true }, Validators.required),
    documento: new FormControl({ value: '', disabled: true }, Validators.required),
    medicoId: new FormControl(null, Validators.required),
    precioConsulta: new FormControl({ value: '', disabled: true }, Validators.required),
    fecha: new FormControl(null, Validators.required),
    hora: new FormControl(null, Validators.required)
  });

  horariosDisponibles = signal<string[]>([]);
  cargando = signal(false);

  private medicosClient = inject(MedicosClient);
  private reservasClient = inject(ReservasClient);
  private perfil = inject(PerfilClient);
  private messageService = inject(MessageService);
  private ref: DynamicDialogRef | null = null;
  private dialogService = inject(DialogService);
  private router = inject(Router); // <--- Router inyectado para la navegación

  ngOnInit(): void {
    this.llenarDatosPaciente();

    const hoy = new Date();
    const treintaDias = new Date();
    treintaDias.setDate(hoy.getDate() + 30);

    this.fechaMin = hoy.toISOString().split('T')[0];
    this.fechaMax = treintaDias.toISOString().split('T')[0];

    this.buscarMedicos();

    this.form.get('fecha')!.valueChanges.subscribe(() => {
      this.buscarHorarios();
    });

    this.form.get('medicoId')!.valueChanges.subscribe((idMedico) => {
      const medico = this.medicos().find(m => m.idMedico == idMedico);
      if (medico) {
        this.form.patchValue({ precioConsulta: `${medico.valorConsulta}` });
      }
      this.buscarHorarios();
    });
  }

  buscarMedicos(): void {
    this.medicosClient.getMedicos().subscribe({
      next: (datos: MedicoModel[]) => {
        this.medicos.set(datos);
      },
      error: (err) => console.error("Error al traer médicos:", err)
    });
  }

  buscarHorarios() {
    const medicoId = this.form.get('medicoId')!.value;
    const fecha = this.form.get('fecha')!.value;

    if (!medicoId || !fecha) {
      this.horariosDisponibles.set([]);
      return;
    }

    this.cargando.set(true);
    this.reservasClient.getHorariosDisponibles(medicoId, fecha).subscribe({
      next: (horarios) => {
        this.horariosDisponibles.set(horarios);
        this.cargando.set(false);
      },
      error: () => {
        this.horariosDisponibles.set([]);
        this.cargando.set(false);
      }
    });
  }

  private llenarDatosPaciente() {
    this.perfil.getPerfil().subscribe({
      next: (datos) => {
        if (datos.rol == RolEnum.ADMINISTRADOR) {
          this.rol.set(true)
          this.perfil.getPerfilPacientesActivos().subscribe({
            next: (pacientes: UsuarioModel[]) => {
              this.form.get('nombre')?.enable();
              
              this.paciente.set(pacientes)
            },
            error: (err) => console.log(err)
          })

        } else if (datos.rol == RolEnum.PACIENTE) {
          this.rol.set(false)
          this.idPaciente = datos.id;
          this.form.patchValue({
            nombre: `${datos.nombres} ${datos.apellidos}`,
            documento: `${datos.documento}`,
          });
        }


      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  confirmarReserva() {
    const medicoId = this.form.get('medicoId')!.value;
    const fecha = this.form.get('fecha')!.value;
    const hora = this.form.get('hora')!.value;
console.log(this.form.get('nombre')?.value)
    this.reservasClient.confirmaReserva(medicoId, this.form.get('nombre')?.value, fecha, hora).subscribe({
      next: (reservaId: any) => {
        this.messageService.add({
          severity: "success",
          summary: '¡Reserva confirmada!',
          detail: `Su turno es ${reservaId.idReserva}. Conserve su número de turno si necesita cancelarlo.`,
          life: 5000
        });
      },
      error: (err) => {
        console.error('Error al confirmar la reserva:', err);
        this.messageService.add({
          severity: "error",
          summary: `${err.error?.message || 'Error desconocido'}. La reserva no se ha realizado`,
          life: 5000
        });
      }
    });
  }

  cancelarTurno() {
    this.ref = this.dialogService.open(CancelarTurnoComponent, {
      header: 'Elija el turno que desea cancelar',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });
  }

  // Método para volver al panel de administración
  volverAlAdmin(): void {
    this.router.navigate(['/admin/panel']);
  }
}