import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Layout } from './pages/layout/layout';
import { MiAgenda } from './pages/mi-agenda/mi-agenda';
import { Catalogo } from './pages/catalogo/catalogo';
import { Admin } from './pages/admin/admin';
import { AvisosBoard } from './pages/avisos-board/avisos-board';
import { SesionForo } from './pages/sesion-foro/sesion-foro';
import { authGuard } from './core/guards/auth-guard';
import { publicGuard } from './core/guards/auth-guard';
import { Register } from './pages/register/register';

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
      // Tu redirección inteligente sin Home
      { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
      
      // EP-03/04: Agendas
      { path: 'mi-agenda', component: MiAgenda },
      { path: 'mis-tutorias', component: MiAgenda }, // Mantenemos esta por si los alumnos la usan
      
      // EP-04: Catálogo de tutorías (HU-13/14)
      { path: 'catalogo', component: Catalogo },
      { path: 'admin', component: Admin },
      { path: 'avisos', component: AvisosBoard },
      { path: 'sesion/:id/foro', component: SesionForo },
    ],
  },
  {
    // Redirección si se escribe una URL que no existe
    path: '**',
    redirectTo: '',
  },
];