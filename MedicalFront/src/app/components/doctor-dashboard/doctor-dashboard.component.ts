import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DoctorService } from '../../services/DoctorService';
import { AuthService } from '../../services/authService';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.css'
})
export class DoctorDashboardComponent implements OnInit {
  appointments: any[] = [];
  doctorId: number | null = null;
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
    console.log('DoctorDashboardComponent initialized');
    if (isPlatformBrowser(this.platformId)) {
      console.log('Running in browser');
      const currentUser = this.authService.getCurrentUser();
      console.log('Current user:', currentUser);
      this.doctorId = currentUser?.id;
      console.log('Doctor ID:', this.doctorId);
      if (this.doctorId) {
        this.loadAppointments();
        this.loadDoctorProfile();
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

  loadDoctorProfile() {
    this.doctorService.getDoctorById(this.doctorId!).subscribe({
      next: (doctor: any) => {
        this.doctorProfile = doctor;
        this.checkMissingAttributes();
        this.profileForm.patchValue(this.doctorProfile);
        this.isProfileComplete = this.missingAttributes.length === 0;
        this.showProfileForm = !this.isProfileComplete;
      },
      error: (error: any) => {
        console.error('Error fetching doctor profile:', error);
      }
    });
  }

  checkMissingAttributes() {
    this.missingAttributes = Object.keys(this.profileForm.controls).filter(
      key => !this.doctorProfile[key] && this.profileForm.get(key)?.validator
    );
  }

  updateProfile() {
    if (this.profileForm.valid && this.doctorId) {
      this.doctorService.updateDoctor(this.doctorId, this.profileForm.value).subscribe({
        next: (updatedDoctor: any) => {
          this.doctorProfile = updatedDoctor;
          this.checkMissingAttributes();
          this.isProfileComplete = this.missingAttributes.length === 0;
          if (this.isProfileComplete) {
            this.showProfileForm = false;
          }
        },
        error: (error: any) => {
          console.error('Error updating doctor profile:', error);
        }
      });
    } else if (!this.doctorId) {
      console.error('Doctor ID is undefined');
    } else {
      this.validateAllFormFields(this.profileForm);
    }
  }

  changeSection(section: string) {
    this.activeSection = section;
    if (section === 'profile' && this.doctorId) {
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
