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
    this.activeSection = section;
    if (section === 'profile') {
      this.loadPatientProfile();
    }
  }
}
