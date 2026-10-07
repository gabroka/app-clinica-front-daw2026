import { Component, inject, OnInit } from "@angular/core";
import { ReservasService } from "../../core/services/reservas.client";
import { signal } from "@angular/core";
import { MedicosService } from "../../core/services/medicos.client";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";


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
  form!: FormGroup;
  horariosDisponibles: string[] = []
  cargando = false
  constructor(private fb: FormBuilder,) { }

  private medicosService = inject(MedicosService)
  private reservasService = inject(ReservasService)

  ngOnInit(): void {
    const hoy = new Date
    const treintaDias = new Date
    treintaDias.setDate(hoy.getDate() + 30)
    this.fechaMin = hoy.toISOString().split('T')[0]
    this.fechaMax = treintaDias.toISOString().split('T')[0]
    console.log('fechaMin: ', this.fechaMin, ' fechaMax: ', this.fechaMax)

    this.buscarMedicos()

    this.form = this.fb.group({
      nombre: [''],
      documento: [''],
      medicoId: [null],
      facha: [null]
    })
    this.form.get('fecha')!.valueChanges.subscribe(()=>this.buscarHorarios())
    this.form.get('medicoId')!.valueChanges.subscribe(()=>this.buscarHorarios())
  }

  buscarMedicos() {
    this.medicosService.getMedicos().subscribe({
      next: (datos) => {
        console.log("datos desde ngOnInit", datos)
        this.medicos.set(datos);

      },
      error: (err) => console.error("Error al traer médicos:", err)
    })
  }
  

  buscarHorarios(){
    const medicoId = this.form.get('medicoId')!.value
    const fecha = this.form.get('fecha')!.value

    if(!medicoId || !fecha){
      this.horariosDisponibles =[]
      return
    }
    this.cargando = true
    this.reservasService.getHorariosDisponibles(medicoId,fecha).subscribe({
      next: (horarios)=>{
        this.horariosDisponibles =horarios
        this.cargando=false
      },
      error:()=>{
        this.horariosDisponibles=[]
        this.cargando=false
      }
    })
  }
}





