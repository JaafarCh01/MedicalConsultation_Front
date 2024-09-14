import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/authService';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../services/PatientService';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent implements OnInit {
  patientProfile: Patient | null = null;
  activeSection: string = 'dashboard';
  profileImageFile: File | null = null;
  profileImageUrl: string | null = null;
  appointments: any[] = [];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadPatientProfile();
    }
  }

  loadPatientProfile() {
    this.patientService.getPatientProfile().subscribe({
      next: (patient: Patient) => {
        this.patientProfile = patient;
        if (patient.user && patient.user.profileImage) { // Access profileImage from user
          this.profileImageUrl = 'data:image/jpeg;base64,' + patient.user.profileImage;
        }
      },
      error: (error: any) => {
        console.error('Error loading patient profile:', error);
      }
    });
  }

  loadAppointments() {
    this.patientService.getPatientAppointments().subscribe({
      next: (appointments) => {
        console.log('Received appointments:', appointments);
        this.appointments = appointments;
        this.activeSection = 'appointments'; // Set the active section
      },
      error: (error) => {
        console.error('Error loading appointments', error);
        this.activeSection = 'appointments'; // Set the active section even if there's an error
      }
    });
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.profileImageFile = files[0];
    }
  }

  uploadImage() {
    if (this.profileImageFile) {
      const formData = new FormData();
      formData.append('profileImage', this.profileImageFile);

      this.patientService.uploadProfileImage(formData).subscribe({
        next: (patient: Patient) => {
          this.patientProfile = patient;
          if (patient.user && patient.user['profileImage']) {
            this.profileImageUrl = 'data:image/jpeg;base64,' + patient.user['profileImage'];
          }
          alert('Profile image uploaded successfully.');
        },
        error: (error: any) => {
          console.error('Error uploading profile image:', error);
          alert('Failed to upload profile image.');
        }
      });
    }
  }

  changeSection(section: string) {
    console.log('Changing section to:', section);
    this.activeSection = section;
    if (section === 'profile') {
      this.loadPatientProfile();
    } else if (section === 'appointments') {
      this.loadAppointments();
    }
    console.log('Active section after change:', this.activeSection);
    console.log('Appointments:', this.appointments);
  }

  bookAppointment(doctorEmail: string) {
    const appointmentDateTime = new Date().toISOString().slice(0, 19); // Format: YYYY-MM-DDTHH:mm:ss
    this.patientService.bookAppointment(doctorEmail, appointmentDateTime).subscribe(
      (response) => {
        console.log('Appointment booked successfully', response);
        alert('Appointment booked successfully');
        this.loadAppointments(); // Refresh the appointments list
      },
      (error) => {
        console.error('Error booking appointment', error);
        let errorMessage = 'An error occurred while booking the appointment.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        alert(errorMessage);
      }
    );
  }

  cancelAppointment(appointmentId: number) {
    this.patientService.cancelAppointment(appointmentId).subscribe({
      next: (response) => {
        console.log('Appointment cancelled successfully', response);
        this.loadAppointments(); // Refresh the appointments list
      },
      error: (error) => {
        console.error('Error cancelling appointment', error);
        alert('Failed to cancel appointment');
      }
    });
  }
}
