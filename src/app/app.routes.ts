import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/mainLayout';
import { HomeComponent } from './pages/home/home';
import { InstitucionalComponent } from './pages/institucional/institucional';
import { TurnosComponent } from './pages/turnos/turnos';

export const routes: Routes = [{
    path: '', component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'institucional', component: InstitucionalComponent },
      { path: 'turnos', component: TurnosComponent }

    ]
  },
  /* {
    path: '', component: AuthLayoutComponent,
    children: [
      {},mo
    ]
  }, */

  { path: '**', redirectTo: '' }
];

