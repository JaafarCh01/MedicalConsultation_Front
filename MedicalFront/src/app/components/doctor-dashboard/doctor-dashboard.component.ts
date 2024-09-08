import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DoctorService } from '../../services/DoctorService';
import { AuthService } from '../../services/authService';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Doctor } from '../../models/doctor.model';
import { MedicalCategories } from '../../models/medical-categories';
import { MedicalCategoriesDisplay } from '../../models/medical-categories-display';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.css'
})
export class DoctorDashboardComponent implements OnInit {
  appointments: any[] = [];
  doctorProfile: Doctor | null = null;
  verificationForm: FormGroup;
  activeSection: string = 'appointments';
  isVerified: boolean = false;
  medicalCategories = Object.values(MedicalCategories);
  medicalCategoriesDisplay = MedicalCategoriesDisplay;

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.verificationForm = this.formBuilder.group({
      speciality: ['', Validators.required],
      education: ['', Validators.required],
      workPlace: ['', Validators.required],
      position: ['', Validators.required],
      workExperienceYears: ['', [Validators.required, Validators.min(0)]],
      awards: [''],
      contactPhone: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      aboutMe: [''],
      specializationDetails: [''],
      workExperienceDetails: [''],
      furtherTraining: [''],
      achievementsAndAwards: [''],
      scientificWorks: [''],
      certificates: [null]
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDoctorProfile();
    }
  }

  loadDoctorProfile() {
    this.doctorService.getDoctorProfile().subscribe({
      next: (doctor: Doctor) => {
        this.doctorProfile = doctor;
        this.isVerified = doctor.verified;
        if (this.isVerified) {
          this.verificationForm.patchValue(doctor);
        }
      },
      error: (error: any) => {
        console.error('Error loading doctor profile:', error);
      }
    });
  }

  onFileChange(event: any) {
    const files = event.target.files;
    this.verificationForm.patchValue({
      certificates: files
    });
  }

  submitVerification() {
    if (this.verificationForm.valid) {
      const formData = new FormData();
      const formValue = this.verificationForm.value;
      
      // Create a new object without the certificates field
      const dataWithoutCertificates = { ...formValue };
      delete dataWithoutCertificates.certificates;

      // Append form data as JSON
      formData.append('data', new Blob([JSON.stringify(dataWithoutCertificates)], {
        type: "application/json"
      }));

      // Append certificates
      if (formValue.certificates) {
        for (let i = 0; i < formValue.certificates.length; i++) {
          formData.append('certificates', formValue.certificates[i]);
        }
      }

      this.doctorService.verifyDoctor(formData).subscribe({
        next: (response: Doctor) => {
          this.doctorProfile = response;
          this.isVerified = true;
          console.log('Verification successful', response);
        },
        error: (error: any) => {
          console.error('Error during verification:', error);
        }
      });
    }
  }

  changeSection(section: string) {
    this.activeSection = section;
    if (section === 'profile') {
      this.loadDoctorProfile();
    }
  }

  formatFieldName(fieldName: string): string {
    const words = fieldName.split(/(?=[A-Z])/).map(word => word.toLowerCase());
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
}
