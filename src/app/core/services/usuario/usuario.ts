import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface RegistroDto {
  nombre: string;
  email: string;
  password: string;
}

export interface SolicitudTutorRequestDto {
  justificacion: string;
}

export interface SolicitudPendienteDto {
  id: string;
  nombre: string;
  email: string;
  justificacion: string;
  estado: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  // API Gateway
  private apiUrl = `${environment.apiGatewayUrl}/usuarios`;

  // Inyectamos el HttpClient
  constructor(private http: HttpClient) {}

  // Método para registrar un nuevo usuario
  public registrar(datos: RegistroDto): Observable<string> {
    return this.http.post(`${this.apiUrl}/registro`, datos, { responseType: 'text' });
  }

  // Método para enviar solicitud para ser tutor
  public enviarSolicitudTutor(datos: SolicitudTutorRequestDto): Observable<string> {
    return this.http.post(`${this.apiUrl}/peticiones`, datos, { responseType: 'text' });
  }

  // Método para obtener la lista de las solicitudes pendientes
  public obtenerSolicitudesPendientes(): Observable<SolicitudPendienteDto[]> {
    return this.http.get<SolicitudPendienteDto[]>(`${this.apiUrl}/peticiones/pendientes`);
  }

  // Método para aceptar una solicitud (Añade el rol TUTOR)
  public aprobarSolicitud(id: string): Observable<string> {
    return this.http.put(`${this.apiUrl}/peticiones/${id}/aprobar`, {}, { responseType: 'text' });
  }

  // Método para rechazar una solicitud
  public rechazarSolicitud(id: string): Observable<string> {
    return this.http.put(`${this.apiUrl}/peticiones/${id}/rechazar`, {}, { responseType: 'text' });
  }
}
