import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { DynamicDialogModule, DialogService, DynamicDialogRef, DynamicDialogConfig, DynamicDialog } from 'primeng/dynamicdialog';
/* import { CancelarTurnoComponent } from "../cancelarTurno/cancelarTurno"; */


@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [RouterLink],
  providers:[DialogService]
})
export class HomeComponent {
  private dialogService = inject(DialogService)
  private ref: DynamicDialogRef | null = null

  /* verTurnos() {
    console.log('estamos en verturnos()')
    const property:boolean=false
     this.ref = this.dialogService.open(CancelarTurnoComponent, { header: 'Consulte su turno' ,data:property}) 
  } */


}


