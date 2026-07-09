import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService, RegistroDto } from '../../core/services/usuario/usuario';
import { ToastService } from '../../core/services/toast/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  // Usamos la interfaz que creamos en el servicio
  registroData: RegistroDto = {
    nombre: '',
    email: '',
    password: '',
  };

  mensajeError = '';
  cargando = false;
  showPassword = false;

  // Inyectamos el nuevo servicio en lugar del HttpClient
  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  onSubmit() {
    this.cargando = true;
    this.mensajeError = '';

    // Llamamos al servicio de manera limpia
    this.usuarioService.registrar(this.registroData).subscribe({
      next: (res) => {
        this.cargando = false;
        this.toastService.mostrar('¡Registro exitoso! Redirigiendo...', 'success');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.cargando = false;
        this.toastService.mostrar(err.error || 'Ocurrió un error al registrar', 'error');
      },
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
