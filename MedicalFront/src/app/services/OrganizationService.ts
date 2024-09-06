import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Organization } from '../models/organization.model';
import { AuthService } from './authService';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = 'http://localhost:8088/api/v1/organization';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  updateOrganization(organizationData: any): Observable<Organization> {
    console.log('Sending update request:', JSON.stringify(organizationData, null, 2));
    return this.http.put<Organization>(`${this.apiUrl}/updateData`, organizationData, { headers: this.getHeaders() })
      .pipe(
        tap(response => {
          console.log('Update response:', JSON.stringify(response, null, 2));
        }),
        catchError(error => {
          console.error('Error in updateOrganization:', error);
          return throwError(() => new Error(`${error.status} ${error.statusText}: ${JSON.stringify(error.error)}`));
        })
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error) {
        errorMessage += `\nDetails: ${JSON.stringify(error.error)}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}
