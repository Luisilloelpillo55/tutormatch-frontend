import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeticionService, Peticion } from '../../core/services/peticion/peticion';
import { ToastService } from '../../core/services/toast/toast';
import { AuthService } from '../../core/services/auth/auth';
import { Toast } from '../../shared/components/toast/toast';

@Component({
  selector: 'app-peticiones',
  standalone: true,
  imports: [CommonModule, FormsModule, Toast],
  templateUrl: './peticiones.html',
  styleUrl: './peticiones.css',
})
export class Peticiones implements OnInit {

  peticiones: Peticion[] = [];
  cargando = false;

  // --- Modal: Nueva petición (HU-33) ---
  mostrarModalNueva = false;
  formulario = { materia: '', descripcion: '' };
  guardando = false;

  // --- Modal: Confirmar eliminar (HU-35) ---
  peticionAEliminar: Peticion | null = null;
  eliminando = false;

  // --- ID de la petición siendo atendida (HU-36) ---
  atendiendoId: string | null = null;

  constructor(
    private peticionService: PeticionService,
    public toastService: ToastService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  // -----------------------------------------------------------------------
  // HU-34: Cargar tablero
  // -----------------------------------------------------------------------
  cargar(): void {
    this.cargando = true;
    this.peticionService.listar().subscribe({
      next: (data) => {
        this.peticiones = data;
        this.cargando = false;
      },
      error: () => {
        this.toastService.mostrar('No se pudo cargar el tablero. Intenta de nuevo.', 'error');
        this.cargando = false;
      },
    });
  }

  // -----------------------------------------------------------------------
  // HU-33: Crear petición
  // -----------------------------------------------------------------------
  abrirModalNueva(): void {
    this.formulario = { materia: '', descripcion: '' };
    this.mostrarModalNueva = true;
  }

  cerrarModalNueva(): void {
    this.mostrarModalNueva = false;
  }

  get formValido(): boolean {
    return this.formulario.materia.trim().length >= 3 &&
           this.formulario.descripcion.trim().length >= 10;
  }

  guardarPeticion(): void {
    if (!this.formValido) return;
    this.guardando = true;
    this.peticionService.crear(this.formulario).subscribe({
      next: () => {
        this.toastService.mostrar('¡Petición publicada exitosamente!', 'success');
        this.cerrarModalNueva();
        this.guardando = false;
        this.cargar();
      },
      error: (err) => {
        const msg = typeof err.error === 'string' ? err.error : 'Error al publicar. Intenta de nuevo.';
        this.toastService.mostrar(msg, 'error');
        this.guardando = false;
      },
    });
  }

  // -----------------------------------------------------------------------
  // HU-35: Eliminar petición propia
  // -----------------------------------------------------------------------
  confirmarEliminar(peticion: Peticion): void {
    this.peticionAEliminar = peticion;
  }

  cancelarEliminar(): void {
    this.peticionAEliminar = null;
  }

  ejecutarEliminar(): void {
    if (!this.peticionAEliminar) return;
    this.eliminando = true;
    this.peticionService.eliminar(this.peticionAEliminar.id).subscribe({
      next: () => {
        this.toastService.mostrar('Petición eliminada.', 'success');
        this.peticionAEliminar = null;
        this.eliminando = false;
        this.cargar();
      },
      error: (err) => {
        const msg = typeof err.error === 'string' ? err.error : 'Error al eliminar. Intenta de nuevo.';
        this.toastService.mostrar(msg, 'error');
        this.peticionAEliminar = null;
        this.eliminando = false;
      },
    });
  }

  // -----------------------------------------------------------------------
  // HU-36: Marcar como atendida (solo TUTOR)
  // -----------------------------------------------------------------------
  atender(peticion: Peticion): void {
    this.atendiendoId = peticion.id;
    this.peticionService.marcarAtendida(peticion.id).subscribe({
      next: (actualizada) => {
        const idx = this.peticiones.findIndex(p => p.id === actualizada.id);
        if (idx !== -1) this.peticiones[idx] = actualizada;
        this.toastService.mostrar(`Petición marcada como atendida.`, 'success');
        this.atendiendoId = null;
      },
      error: (err) => {
        const msg = typeof err.error === 'string' ? err.error : 'Error al actualizar. Intenta de nuevo.';
        this.toastService.mostrar(msg, 'error');
        this.atendiendoId = null;
      },
    });
  }

  // -----------------------------------------------------------------------
  // Helpers UI
  // -----------------------------------------------------------------------
  esDueno(peticion: Peticion): boolean {
    return this.authService.hasRole('ROLE_ALUMNO') &&
           peticion.alumnoId === this.authService.userId;
  }

  formatearFecha(iso: string): string {
    return new Date(iso).toLocaleDateString('es-MX', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }
}
