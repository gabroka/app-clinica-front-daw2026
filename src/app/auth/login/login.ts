import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { LoginApiClient } from "./login-api-client";
import { AuthStore } from "../auth-store";
import { Router, RouterLink } from "@angular/router";
import { Button } from "primeng/button";
import { Password } from "primeng/password";
import { InputText } from "primeng/inputtext";

@Component({
    selector: "app-login",
    templateUrl: "./login.html",
    styleUrl: "./login.css",
    imports: [ReactiveFormsModule, InputText, Password, Button],
})
export class LoginComponent {
    //// Inyección de dependencias usando la función inject() de Angular
    private readonly messageService: MessageService = inject(MessageService);
    private readonly loginApiClient: LoginApiClient = inject(LoginApiClient);
    private readonly authStore: AuthStore = inject(AuthStore);
    private readonly router: Router = inject(Router);

    // Definición del formulario reactivo con los campos de credenciales y validadores obligatorios
    form: FormGroup = new FormGroup({
        nombre: new FormControl(null, Validators.required),
        clave: new FormControl(null, Validators.required)
    });

    // Método que se ejecuta al hacer clic en el botón de iniciar sesión
    iniciarSesion() {
        // Validación: comprueba que el formulario sea válido antes de enviar la petición
        if (!this.form.valid) {
            this.messageService.add({ severity: "error", summary: "Es necesario completar todos los campos del formulario para avanzar" });
            return;
        }

        // Extracción de los valores ingresados en los controles del formulario
        const nombre: string = this.form.value.nombre;
        const clave: string = this.form.value.clave;

        // Consumo del servicio de autenticación para validar usuario y contraseña en el backend
        this.loginApiClient.iniciarSesion(nombre, clave).subscribe({
            next: (res: any) => {
                // Guarda el token
                this.authStore.guardarToken(res.accessToken);
                
                // Obtiene el rol directamente de la respuesta del servidor
                const rol = res.rol || res.usuario?.rol; 

                // Redirigir según el rol
                this.redirigirSegunRol(rol);
            },
            error: (err) => {
                console.error(err);
                // Notifica al usuario en caso de credenciales incorrectas o falla en el servidor
                this.messageService.add({ severity: "error", summary: "Ha ocurrido un error al iniciar sesión. Verifique las credenciales ingresadas" });
            }
        });
    }

    // Método auxiliar para direccionar al usuario al panel correspondiente segun su rol
    private redirigirSegunRol(rol: string) {
        switch (rol?.toUpperCase()) {
            case 'ADMINISTRADOR':
                this.router.navigateByUrl('/admin/panel');
                break;
            case 'PACIENTE':
                this.router.navigateByUrl('/paciente/panel');
                break;
            case 'MEDICO':
                this.router.navigateByUrl('/medico/agenda');
                break;
            default:
                // Redirige por defecto al login si el rol no coincide con ninguno de los esperados
                this.router.navigateByUrl('/login'); 
                break;
        }
    }
}