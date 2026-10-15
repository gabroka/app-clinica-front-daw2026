import { Component, inject, OnInit } from "@angular/core";
import { ReservasService } from "../../core/services/reservas.client";
import { signal } from "@angular/core";
import { MedicosService } from "../../core/services/medicos.client";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Medico } from "../../models/medico.model";
import { Perfil } from "../../core/services/perfil.client";
import { MessageService } from "primeng/api";



@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.html',
  styleUrl: './turnos.css',
  imports: [ReactiveFormsModule]
})

export class TurnosComponent implements OnInit {
  fechaMin: string = '';
  fechaMax: string = '';
  medicos = signal<any[]>([])
  private idPaciente: number = 0
  form: FormGroup = new FormGroup({
    nombre: new FormControl({ value: '', disabled: true }, Validators.required),
    documento: new FormControl({ value: '', disabled: true }, Validators.required),
    medicoId: new FormControl(null, Validators.required),
    precioConsulta: new FormControl({ value: '', disabled: true }, Validators.required),
    fecha: new FormControl(null, Validators.required),
    hora: new FormControl(null, Validators.required)
  });
  horariosDisponibles = signal<string[]>([])
  cargando = signal(false)


  private medicosService = inject(MedicosService)
  private reservasService = inject(ReservasService)
  private perfil = inject(Perfil)
  private messageService = inject(MessageService)

  ngOnInit(): void {
    this.llenarDatosPaciente()
    const hoy = new Date
    const treintaDias = new Date
    treintaDias.setDate(hoy.getDate() + 30)
    this.fechaMin = hoy.toISOString().split('T')[0]
    this.fechaMax = treintaDias.toISOString().split('T')[0]


    this.buscarMedicos()


    this.form.get('fecha')!.valueChanges.subscribe(() => {
      
      this.buscarHorarios()
    })
    this.form.get('medicoId')!.valueChanges.subscribe(() => {
      const medico = (this.medicos().filter(m => m.idMedico == this.form.get('medicoId')!.value))
      this.form.patchValue({ precioConsulta: `${medico[0].valorConsulta}` })
      
      this.buscarHorarios()
    })
  }

  buscarMedicos(): void {
    this.medicosService.getMedicos().subscribe({
      next: (datos: Medico[]) => {
        
        this.medicos.set(datos);



      },
      error: (err) => console.error("Error al traer médicos:", err)
    })
  }


  buscarHorarios() {
    const medicoId = this.form.get('medicoId')!.value

    const fecha = this.form.get('fecha')!.value
    
    if (!medicoId || !fecha) {
      this.horariosDisponibles.set([])
      return
    }
    this.cargando.set(true)
    this.reservasService.getHorariosDisponibles(medicoId, fecha).subscribe({
      next: (horarios) => {
        this.horariosDisponibles.set(horarios)
        this.cargando.set(false)
      },
      error: () => {
        this.horariosDisponibles.set([])
        this.cargando.set(false)
      }
    })
  }

  private llenarDatosPaciente() {

    this.perfil.getPerfil().subscribe({
      next: (datos) => {
        this.idPaciente = datos.id
        this.form.patchValue({
          nombre: `${datos.nombres} ${datos.apellidos}`,
          documento: `${datos.documento}`,

        })
      },

      error: (err) => {
        console.log(err)
      }

    })

  }

  confirmarReserva() {
    const medicoId = this.form.get('medicoId')!.value
    const fecha = this.form.get('fecha')!.value
    const hora = this.form.get('hora')!.value
    
    this.reservasService.confirmaReserva(medicoId, this.idPaciente, fecha, hora).subscribe({
      next: (reservaId) => {
        console.log('Reserva confirmada con ID:', typeof(reservaId), reservaId);
        this.messageService.add({ severity: "success", summary: `Reserva confirmada con éxito, su turno es \`${reservaId.id}\`conserve su numero de turno si necesita cancelarlo` })

      },
      error: (err) => {
        console.error('Error al confirmar la reserva:', err);
        this.messageService.add({ severity: "error", summary: "Ha ocurrido un error al confirmar la reserva" })

      }
    });
  }
}





