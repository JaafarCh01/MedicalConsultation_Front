import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DoctorService } from '../../services/DoctorService';
import { AuthService } from '../../services/authService';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Doctor } from '../../models/doctor.model';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.css'
})
export class DoctorDashboardComponent implements OnInit {
  appointments: any[] = [];
  doctorProfile: any;
  profileForm: FormGroup;
  missingAttributes: string[] = [];
  activeSection: string = 'appointments';
  isProfileComplete: boolean = false;
  showProfileForm: boolean = false;

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      speciality: ['', Validators.required],
      education: ['', Validators.required],
      workPlace: ['', Validators.required],
      position: ['', Validators.required],
      workExperienceYears: ['', Validators.required],
      awards: [''],
      contactPhone: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      aboutMe: [''],
      specializationDetails: [''],
      workExperienceDetails: [''],
      furtherTraining: [''],
      achievementsAndAwards: [''],
      scientificWorks: ['']
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
 
    }
  }


  loadDoctorProfile() {
    this.doctorService.getDoctorProfile().subscribe({
      next: (doctor: Doctor) => {
        this.doctorProfile = doctor;
        this.profileForm.patchValue({
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          // ... other fields
        });
        this.checkMissingAttributes();
      },
      error: (error: any) => {
        console.error('Error loading doctor profile:', error);
        if (error.status === 403) {
          // Handle forbidden error (e.g., redirect to login or show message)
          console.log('User role:', this.authService.getUserRole());
        }
      }
    });
  }

  checkMissingAttributes() {
    this.missingAttributes = Object.keys(this.profileForm.controls).filter(
      key => !this.profileForm.get(key)?.value && this.profileForm.get(key)?.validator
    );
  }

  updateProfile() {
    if (!this.authService.isAuthenticated()) {
      console.error('User is not authenticated');
      // Handle unauthenticated user (e.g., redirect to login)
      return;
    }

    if (this.profileForm.valid) {
      console.log('Full form data:', this.profileForm.value);
      this.doctorService.updateDoctor(this.profileForm.value).subscribe({
        next: (updatedDoctor: Doctor) => {
          this.doctorProfile = updatedDoctor;
          this.checkMissingAttributes();
          console.log('Profile updated successfully', updatedDoctor);
        },
        error: (error: any) => {
          console.error('Error updating doctor profile:', error);
          // You can add user-friendly error handling here, e.g., showing an error message to the user
          // For example:
          // this.errorMessage = `Failed to update profile: ${error.message}`;
        }
      });
    } else {
      console.log('Form is invalid', this.profileForm.errors);
    }
  }

  changeSection(section: string) {
    this.activeSection = section;
    if (section === 'profile') {
      this.loadDoctorProfile();
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }

  formatFieldName(fieldName: string): string {
    const words = fieldName.split(/(?=[A-Z])/).map(word => word.toLowerCase());
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
}
