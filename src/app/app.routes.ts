import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/mainLayout';
import { HomeComponent } from './pages/home/home';
import { TurnosComponent } from './pages/turnos/turnos';
import { LoginComponent } from './auth/login/login';
import { AuthLayoutComponent } from './layout/auth-layout/authLayout';
import { AdminComponent } from './pages/admin/admin';
import { PacienteComponent } from './pages/paciente/paciente';
import { MedicoComponent } from './pages/medico/medico';
import { ValorconsultaComponent } from './pages/valorconsulta/valorconsulta';


//Configuración de las rutas principales de la app. Define la estructura de navegación
// agrupando las páginas públicas bajo el diseño principal,
//las vistas de autenticación, los paneles exclusivos por rol de usuario 
// y una ruta comodín.

export const routes: Routes = [
  // Rutas públicas con diseño principal
  {
    path: '', 
    component: MainLayoutComponent,
    children: [
      // Vista de inicio principal
      { path: '', component: HomeComponent },
      // Vista de solicitud y gestión de turnos
      { path: 'turnos', component: TurnosComponent },
    ]
  },
  // Rutas de autenticación (Login)
  {
    path: '', 
    component: AuthLayoutComponent,
    children: [
      // Vista de inicio de sesión
      { path: 'login', component: LoginComponent }
    ]
  },
 
  // Paneles y vistas específicas protegidas según el rol del usuario
  {
    path: 'admin/panel',
    component: AdminComponent
  },
  {
    path: 'paciente/panel',
    component: PacienteComponent
  },
  {
    path: 'medico/agenda',
    component: MedicoComponent
  },

  { path: 'pages/valorconsulta', 
    component: ValorconsultaComponent},

  
  // Ruta por defecto o comodín
  { 
    path: '**', 
    redirectTo: '' 
  }
];