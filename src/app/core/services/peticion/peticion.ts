import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

// -----------------------------------------------------------------------
// Interfaces (DTOs) — coinciden con el backend
// -----------------------------------------------------------------------

export interface Peticion {
  id: string;
  alumnoId: string;
  alumnoNombre: string;
  materia: string;
  descripcion: string;
  estado: 'activa' | 'atendida';
  tutorAtendioId: string | null;
  tutorAtendioNombre: string | null;
  creadoEn: string;
}

export interface PeticionRequest {
  materia: string;
  descripcion: string;
}

// -----------------------------------------------------------------------
// Service
// -----------------------------------------------------------------------

@Injectable({
  providedIn: 'root',
})
export class PeticionService {
  private baseUrl = `${environment.apiGatewayUrl}/core`;

  constructor(private http: HttpClient) {}

  /**
   * HU-33: Crear una nueva petición (ROLE_ALUMNO).
   */
  crear(dto: PeticionRequest): Observable<Peticion> {
    return this.http.post<Peticion>(`${this.baseUrl}/peticiones`, dto);
  }

  /**
   * HU-34: Listar todas las peticiones activas (ALUMNO y TUTOR).
   */
  listar(): Observable<Peticion[]> {
    return this.http.get<Peticion[]>(`${this.baseUrl}/peticiones`);
  }

  /**
   * HU-35: Eliminar petición propia (ROLE_ALUMNO).
   */
  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/peticiones/${id}`);
  }

  /**
   * HU-36: Marcar petición como atendida (ROLE_TUTOR).
   */
  marcarAtendida(id: string): Observable<Peticion> {
    return this.http.patch<Peticion>(`${this.baseUrl}/peticiones/${id}/atender`, {});
  }
}
