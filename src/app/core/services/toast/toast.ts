import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  mensaje: string;
  tipo: 'success' | 'error' | 'info' | 'confirm';
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<ToastMessage | null>();
  public toast$ = this.toastSubject.asObservable();

  private timer: any;

  mostrar(mensaje: string, tipo: 'success' | 'error' | 'info' = 'info') {
    this.limpiarTimer();
    this.toastSubject.next({ mensaje, tipo });

    this.timer = setTimeout(() => this.cerrar(), 3500);
  }

  preguntar(mensaje: string, onConfirm: () => void, onCancel?: () => void) {
    this.limpiarTimer();

    this.toastSubject.next({
      mensaje,
      tipo: 'confirm',
      onConfirm: () => {
        onConfirm();
        this.cerrar();
      },
      onCancel: () => {
        if (onCancel) onCancel();
        this.cerrar();
      },
    });
  }

  cerrar() {
    this.toastSubject.next(null);
  }

  private limpiarTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}
