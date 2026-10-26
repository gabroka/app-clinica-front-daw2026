import { Component, inject, OnInit, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { ReservasClient } from "../../core/services/reservas.client";
import { MedicosClient } from "../../core/services/medicos.client";
import { PerfilClient } from "../../core/services/perfil.client";
import { MedicoModel } from "../../models/medico.model";
import { Router } from '@angular/router';
import { RolEnum } from "../../models/rol-enum";
import { UsuarioModel } from '../../models/usuario.model'
import { AuthStore } from "../../auth/auth-store";
import { ReservaModel } from "../../models/reserva.model";

//Componente para la gestión y creación de reservas o turnos médicos.
//Permite a pacientes o administradores seleccionar profesionales, fechas, horarios 
//y confirmar citas con validaciones reactivas.
@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.html',
  styleUrl: './turnos.css',
  imports: [ReactiveFormsModule],
  providers: []
})
export class TurnosComponent implements OnInit {
  //Fecha mínima y maxima permitida para seleccionar un turno (
  fechaMin: string = '';
  //30 dias a partir de hoy
  fechaMax: string = ''; 
  //signal reactivo que almacena el listado de médicos disponibles
  medicos = signal<MedicoModel[]>([]);
  // Identificador único del paciente asociado a la reserva 
  protected idPaciente: number = 0;
  // Signal reactivo que almacena la lista de pacientes activos (usado por admins)
  protected paciente = signal<UsuarioModel[]>([])
  // Signal booleano que define el rol, true para administrador, false para paciente 
  protected rol = signal<boolean>(false)//true para el administrador, false para el paciente


  // Formulario reactivo principal para estructurar los datos del turno
  form: FormGroup = new FormGroup({
    nombre: new FormControl({ value: '', disabled: true }, Validators.required),
    documento: new FormControl({ value: '', disabled: true }, Validators.required),
    medicoId: new FormControl(null, Validators.required),
    precioConsulta: new FormControl({ value: '', disabled: true }, Validators.required),
    fecha: new FormControl(null, Validators.required),
    hora: new FormControl(null, Validators.required)
  });


  // Signal reactivo que almacena los horarios disponibles para el médico y fecha seleccionados
  horariosDisponibles = signal<string[]>([]);
  cargando = signal(false);

  // Inyección de servicios
  private medicosClient = inject(MedicosClient);
  private reservasClient = inject(ReservasClient);
  private perfil = inject(PerfilClient);
  private messageService = inject(MessageService);
  private router = inject(Router); 
private auth=inject (AuthStore)

  // Configura las fechas límite, carga los datos del perfil y médicos
  ngOnInit(): void {
    this.llenarDatosPaciente();

    const hoy = new Date();
    const treintaDias = new Date();
    treintaDias.setDate(hoy.getDate() + 30);

    this.fechaMin = hoy.toISOString().split('T')[0];
    this.fechaMax = treintaDias.toISOString().split('T')[0];

    this.buscarMedicos();

    // Actualiza los horarios disponibles al modificar la fecha del turno
    this.form.get('fecha')!.valueChanges.subscribe(() => {
      this.buscarHorarios();
    });

    // Actualiza el precio de la consulta y los horarios al cambiar de médico seleccionado
    this.form.get('medicoId')!.valueChanges.subscribe((idMedico) => {
      const medico = this.medicos().find(m => m.idMedico == idMedico);
      if (medico) {
        this.form.patchValue({ precioConsulta: `${medico.valorConsulta}` });
      }
      this.buscarHorarios();
    });
  }

  // Obtiene desde el backend el listado completo de médicos
  buscarMedicos(): void {
    this.medicosClient.getMedicos().subscribe({
      next: (datos: MedicoModel[]) => {
        this.medicos.set(datos);
      },
      error: (err) => console.error("Error al traer médicos:", err)
    });
  }

  // Consulta horarios disponibles para el médico y la fecha seleccionados en el formulario
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

  // Carga la información del perfil de usuario activo 
  // para configurar permisos y campos según su rol 
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
            error: (err) => console.log('error al obtener lista de pacientes: ',err)
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
        console.log('error al recibir usuario logueado: ',err);
      }
    });
  }

  //Confirma y registra la reserva del turno médico enviando los datos al servidor 
  confirmarReserva() {
    const medicoId = this.form.get('medicoId')!.value;
    const fecha = this.form.get('fecha')!.value;
    const hora = this.form.get('hora')!.value;
    const pacienteId = this.rol()? this.form.get('nombre')?.value : this.idPaciente;

    /* console.log(this.form.get('nombre')?.value,' pacienteId: ',pacienteId) */
    this.reservasClient.confirmaReserva(medicoId, pacienteId, fecha, hora).subscribe({
      next: (reservaId: ReservaModel) => {
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

 
//Cierra la sesión activa del usuario y redirige a la vista de inicio de sesión 
logout(): void {
  this.auth.cerrarSesion() 
}

// Redirige al panel correspondiente según el rol del usuario actual (Admin o Paciente)
  volverAlAdmin(): void {
    if(this.rol()){
    this.router.navigate(['/admin/panel']);
    }else if(!this.rol()){
      this.router.navigate(['/paciente/panel']);
    }
  }
}