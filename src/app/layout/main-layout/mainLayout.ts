import { Component } from "@angular/core";
import { HomeComponent } from "../../pages/home/home";
import { HeaderComponent } from "../../pages/header/header";
import { FooterComponent } from "../../pages/footer/footer";
import { InstitucionalComponent } from "../../pages/institucional/institucional";
import { RouterOutlet } from "@angular/router";


@Component({
  selector:'app-mainLayout',
  templateUrl:'./mainLayout.html',
imports: [RouterOutlet,HeaderComponent,FooterComponent]
})
export class MainLayoutComponent {}