import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DoctorService } from '../../services/DoctorService';
import { AuthService } from '../../services/authService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.css'
})
export class DoctorDashboardComponent implements OnInit {
  appointments: any[] = [];
  doctorId: number | null = null;

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    console.log('DoctorDashboardComponent initialized');
    if (isPlatformBrowser(this.platformId)) {
      console.log('Running in browser');
      const currentUser = this.authService.getCurrentUser();
      console.log('Current user:', currentUser);
      this.doctorId = currentUser?.id;
      console.log('Doctor ID:', this.doctorId);
      if (this.doctorId) {
        this.loadAppointments();
      } else {
        console.error('No doctor ID found');
      }
    } else {
      console.log('Not running in browser');
    }
  }

  loadAppointments() {
    console.log('Loading appointments for doctor ID:', this.doctorId);
    if (this.doctorId) {
      this.doctorService.getDoctorAppointments(this.doctorId).subscribe({
        next: (appointments) => {
          console.log('Appointments received:', appointments);
          this.appointments = appointments;
        },
        error: (error) => {
          console.error('Error fetching appointments:', error);
        }
      });
    }
  }
}
