import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth';
import {
  PerfilService,
  EstadisticasTutor,
  EstadisticasAlumno,
} from '../../core/services/perfil/perfil';
import { UsuarioService } from '../../core/services/usuario/usuario';
import { ToastService } from '../../core/services/toast/toast';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  // Variables para las Estadísticas
  estadisticasTutor: EstadisticasTutor | null = null;
  estadisticasAlumno: EstadisticasAlumno | null = null;
  cargando = false;

  // Variables para la Solicitud de Tutor
  estadoSolicitud: string = 'NINGUNA';
  mostrarModal = false;
  justificacion = '';
  enviandoSolicitud = false;

  constructor(
    public authService: AuthService,
    private perfilService: PerfilService,
    private usuarioService: UsuarioService,
    private toastService: ToastService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    if (this.authService.hasRole('ROLE_TUTOR')) {
      this.cargarEstadisticasTutor();
    }
    if (this.authService.hasRole('ROLE_ALUMNO')) {
      this.cargarEstadisticasAlumno();

      // Si es alumno (y no admin), consultamos su estado de solicitud
      if (!this.authService.hasRole('ROLE_ADMIN') && !this.authService.hasRole('ROLE_TUTOR')) {
        this.verificarEstadoSolicitud();
      }
    }
  }

  private cargarEstadisticasTutor(): void {
    this.cargando = true;
    this.perfilService.getEstadisticasTutor().subscribe({
      next: (data) => {
        this.estadisticasTutor = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      },
    });
  }

  private cargarEstadisticasAlumno(): void {
    this.cargando = true;
    this.perfilService.getEstadisticasAlumno().subscribe({
      next: (data) => {
        this.estadisticasAlumno = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      },
    });
  }

  private verificarEstadoSolicitud(): void {
    const userId = this.authService.userId;
    if (!userId) return;

    this.http.get<any>(`${environment.apiGatewayUrl}/usuarios/${userId}`).subscribe({
      next: (data) => {
        this.estadoSolicitud = data.estadoSolicitud;

        if (this.estadoSolicitud === 'aceptado') {
          this.toastService.mostrar(
            '¡Felicidades! Tu solicitud fue aprobada. Actualizando permisos...',
            'success',
          );
          this.authService.refrescarToken();
        }
      },
    });
  }

  abrirModal(): void {
    this.justificacion = '';
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    if (!this.enviandoSolicitud) {
      this.mostrarModal = false;
    }
  }

  enviarSolicitud(): void {
    if (this.justificacion.trim().length < 20) {
      this.toastService.mostrar('La justificación debe tener al menos 20 caracteres.', 'error');
      return;
    }

    this.enviandoSolicitud = true;
    this.usuarioService.enviarSolicitudTutor({ justificacion: this.justificacion }).subscribe({
      next: () => {
        this.toastService.mostrar(
          'Solicitud enviada exitosamente. Un administrador la revisará pronto.',
          'success',
        );
        this.estadoSolicitud = 'pendiente';
        this.enviandoSolicitud = false;
        this.cerrarModal();
      },
      error: (err) => {
        this.toastService.mostrar(err.error || 'Error al enviar la solicitud.', 'error');
        this.enviandoSolicitud = false;
      },
    });
  }
}