import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { AuthService } from './authService'; // Assuming AuthService is in the same directory
import { Doctor } from '../models/doctor.model';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:8088/api/v1/doctor'; // Updated to match the backend URL

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('Token being sent:', token); // Add this line for debugging
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getDoctorPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patients`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getDoctorProfile(): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/profile`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/all`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  verifyDoctor(verificationData: FormData): Observable<Doctor> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.post<Doctor>(`${this.apiUrl}/verifyDoctor`, verificationData, { 
      headers: headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  uploadProfileImage(formData: FormData): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.apiUrl}/upload-profile-image`, formData, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}` // Include authorization if needed
      }
    });
  }

  private handleError = (error: HttpErrorResponse) => {
    console.error('An error occurred:', error);
    return throwError(() => new Error(`${error.status} ${error.statusText}: ${error.message}`));
  }
}
