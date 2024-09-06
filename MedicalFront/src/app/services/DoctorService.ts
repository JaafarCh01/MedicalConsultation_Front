import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { AuthService } from './authService'; // Assuming AuthService is in the same directory
import { Doctor } from '../models/doctor.model';

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

  updateDoctor(doctorData: any): Observable<Doctor> {
    console.log('Sending update request:', JSON.stringify(doctorData, null, 2));
    return this.http.put<Doctor>(`${this.apiUrl}/updateData`, doctorData, { headers: this.getHeaders() })
      .pipe(
        tap(response => {
          console.log('Update response:', JSON.stringify(response, null, 2));
          // Log each field separately using type-safe property access
          Object.keys(response).forEach(key => {
            console.log(`${key}:`, (response as any)[key]);
          });
        }),
        catchError(error => {
          console.error('Error in updateDoctor:', error);
          if (error.error instanceof Array) {
            const errorMessages = error.error.map((err: any) => err.defaultMessage).join(', ');
            return throwError(() => new Error(`${error.status} ${error.statusText}: ${errorMessages}`));
          }
          return throwError(() => new Error(`${error.status} ${error.statusText}: ${JSON.stringify(error.error)}`));
        })
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
    return this.http.post<Doctor>(`${this.apiUrl}/verifyDoctor`, verificationData, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError = (error: HttpErrorResponse) => {
    console.error('An error occurred:', error);
    return throwError(() => new Error(`${error.status} ${error.statusText}: ${error.message}`));
  }
}
