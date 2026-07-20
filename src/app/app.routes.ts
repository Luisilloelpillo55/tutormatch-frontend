import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Layout } from './pages/layout/layout';
import { MiAgenda } from './pages/mi-agenda/mi-agenda';
import { Catalogo } from './pages/catalogo/catalogo';
import { Admin } from './pages/admin/admin';
import { AdminTutores } from './pages/admin-tutores/admin-tutores';
import { AvisosBoard } from './pages/avisos-board/avisos-board';
import { SesionForo } from './pages/sesion-foro/sesion-foro';
import { TomarAsistencia } from './pages/tomar-asistencia/tomar-asistencia';
import { MiHistorialAsistencia } from './pages/mi-historial/mi-historial-asistencia';
import { authGuard } from './core/guards/auth-guard';
import { publicGuard } from './core/guards/auth-guard';
import { Register } from './pages/register/register';
import { Perfil } from './pages/perfil/perfil';
import { Peticiones } from './pages/peticiones/peticiones';

export const routes: Routes = [
  {
    // Ruta pública
    path: '',
    canActivate: [publicGuard],
    component: Landing,
  },
  {
    // Ruta pública para registro
    path: 'registro',
    canActivate: [publicGuard],
    component: Register,
  },
  {
    // Rutas privadas (protegidas por authGuard, con Navbar del Layout)
    path: 'app',
    component: Layout,
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
      { path: 'mi-agenda', component: MiAgenda },
      { path: 'catalogo', component: Catalogo },
      {
        path: 'historial',
        loadComponent: () =>
          import('./pages/historial/historial.component').then((m) => m.HistorialComponent),
      },
      { path: 'admin', component: Admin },
      { path: 'admin-tutores', component: AdminTutores },
      { path: 'avisos', component: AvisosBoard },
      { path: 'sesion/:id/foro', component: SesionForo },
      { path: 'sesion/:id/asistencia', component: TomarAsistencia },
      { path: 'mi-historial-asistencia', component: MiHistorialAsistencia },
      { path: 'perfil', component: Perfil },
      { path: 'peticiones', component: Peticiones },
    ],
  },
  {
    // Redirección si se escribe una URL que no existe
    path: '**',
    redirectTo: '',
  },
];
