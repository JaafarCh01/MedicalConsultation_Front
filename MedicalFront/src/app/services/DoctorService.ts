import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { AuthService } from './authService'; // Assuming AuthService is in the same directory

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:8088/api/v1/doctor'; // Updated to match the backend URL

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    console.log('Headers for request:', headers.keys().map(key => `${key}: ${headers.get(key)}`));
    return headers;
  }

  getDoctorAppointments(doctorId: number): Observable<any[]> {
    console.log('Fetching appointments for doctor ID:', doctorId);
    return this.http.get<any[]>(`${this.apiUrl}/${doctorId}/appointments`, { headers: this.getHeaders() })
      .pipe(
        tap(appointments => console.log('Appointments received:', appointments)),
        catchError(error => {
          console.error('Error in getDoctorAppointments:', error);
          throw error;
        })
      );
  }

  getDoctorPatients(doctorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patients/${doctorId}`, { headers: this.getHeaders() });
  }

  updateDoctor(doctorId: number, doctorData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateData`, doctorData, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('Error in updateDoctor:', error);
          throw error;
        })
      );
  }

  getDoctorById(doctorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${doctorId}`, { headers: this.getHeaders() });
  }
}
