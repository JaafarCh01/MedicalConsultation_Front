import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './authService';
import { Patient } from '../models/patient.model';



@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:8088/api/v1/patient'; // Update to match your backend URL

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getPatientProfile(): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/profile`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  uploadProfileImage(formData: FormData): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiUrl}/upload-profile-image`, formData, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}` // Include authorization if needed
      }
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError = (error: HttpErrorResponse) => {
    console.error('An error occurred:', error);
    return throwError(() => new Error(`${error.status} ${error.statusText}: ${error.message}`));
  }
}
