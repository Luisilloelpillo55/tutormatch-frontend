import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService, SolicitudPendienteDto } from '../../core/services/usuario/usuario';
import { ToastService } from '../../core/services/toast/toast';

@Component({
  selector: 'app-solicitudes-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-tutores.html',
  styleUrl: './admin-tutores.css',
})
export class AdminTutores implements OnInit {
  solicitudes: SolicitudPendienteDto[] = [];
  cargandoSolicitudes = true;
  errorSolicitudes = false;
  procesando = new Set<string>();

  constructor(
    private usuarioService: UsuarioService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.cargandoSolicitudes = true;
    this.errorSolicitudes = false;
    this.usuarioService.obtenerSolicitudesPendientes().subscribe({
      next: (solicitudes) => {
        this.solicitudes = solicitudes;
        this.cargandoSolicitudes = false;
      },
      error: () => {
        this.cargandoSolicitudes = false;
        this.errorSolicitudes = true;
        this.toastService.mostrar('No se pudieron cargar las solicitudes pendientes', 'error');
      },
    });
  }

  aprobar(solicitud: SolicitudPendienteDto): void {
    this.toastService.preguntar(
      `¿Aprobar la solicitud de ${solicitud.nombre} y convertirlo en Tutor?`,
      () => {
        this.procesando.add(solicitud.id);
        this.usuarioService.aprobarSolicitud(solicitud.id).subscribe({
          next: () => {
            this.quitarDeLaTabla(solicitud.id);
            this.toastService.mostrar(`Solicitud de ${solicitud.nombre} aprobada`, 'success');
          },
          error: () => {
            this.procesando.delete(solicitud.id);
            this.toastService.mostrar('No se pudo aprobar la solicitud', 'error');
          },
        });
      },
    );
  }

  rechazar(solicitud: SolicitudPendienteDto): void {
    this.toastService.preguntar(`¿Rechazar la solicitud de ${solicitud.nombre}?`, () => {
      this.procesando.add(solicitud.id);
      this.usuarioService.rechazarSolicitud(solicitud.id).subscribe({
        next: () => {
          this.quitarDeLaTabla(solicitud.id);
          this.toastService.mostrar(`Solicitud de ${solicitud.nombre} rechazada`, 'info');
        },
        error: () => {
          this.procesando.delete(solicitud.id);
          this.toastService.mostrar('No se pudo rechazar la solicitud', 'error');
        },
      });
    });
  }

  private quitarDeLaTabla(usuarioId: string): void {
    this.solicitudes = this.solicitudes.filter((s) => s.id !== usuarioId);
    this.procesando.delete(usuarioId);
  }
}
