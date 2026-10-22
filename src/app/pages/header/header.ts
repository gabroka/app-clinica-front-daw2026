import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
/* import { LogoutService } from "../../auth/logout"; */


@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  imports: [RouterLink]
})
export class HeaderComponent implements OnInit {
  protected isAutenticated = signal(false);
  /* private logout = inject(LogoutService) */
  ngOnInit(): void {
    this.isAutenticated.set(sessionStorage.getItem('accessToken') !== null);

  }

  /* cerrarSesion(){
    this.logout.logout()
  } */
}