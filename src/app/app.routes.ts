import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/mainLayout';
import { HomeComponent } from './pages/home/home';
import { InstitucionalComponent } from './pages/institucional/institucional';
import { TurnosComponent } from './pages/turnos/turnos';
import { LoginComponent } from './auth/login/login';
import { AuthLayoutComponent } from './layout/auth-layout/authLayout';

import { AdminComponent } from './pages/admin/admin';
import { PacienteComponent } from './pages/paciente/paciente';
import { MedicoComponent } from './pages/medico/medico';

export const routes: Routes = [
  // Rutas públicas con diseño principal
  {
    path: '', 
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'institucional', component: InstitucionalComponent },
      { path: 'turnos', component: TurnosComponent },
    ]
  },
  // Rutas de autenticación (Login)
  {
    path: '', 
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent }
    ]
  },
  // Rutas protegidas por rol
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
  // Ruta por defecto o comodín
  { 
    path: '**', 
    redirectTo: '' 
  }
];