import { Injectable, inject } from "@angular/core";
import { AuthStore } from "../auth/auth-store"; // Ajusta la ruta relativa según corresponda

@Injectable({ providedIn: "root" })
export class LogoutService {
  private readonly authStore = inject(AuthStore);

  logout() {
    // Reutiliza directamente el método de limpieza y redirección de tu AuthStore
    this.authStore.cerrarSesion();
  }
}