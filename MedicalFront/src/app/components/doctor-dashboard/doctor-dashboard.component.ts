import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DoctorService } from '../../services/DoctorService';
import { AuthService } from '../../services/authService';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Doctor } from '../../models/doctor.model';
import { MedicalCategories } from '../../models/medical-categories';
import { MedicalCategoriesDisplay } from '../../models/medical-categories-display';
import { Router } from '@angular/router';

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
  verificationError: any = {};
  verificationSuccess: string | null = null;
  profileImageFile: File | null = null;
  profileImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.verificationForm = this.fb.group({
      speciality: ['', [Validators.required]],
      education: ['', [Validators.required]],
      workPlace: ['', [Validators.required]],
      position: ['', [Validators.required]],
      workExperienceYears: ['', [Validators.required, Validators.min(0)]],
      awards: [''],
      contactPhone: ['', [Validators.required, Validators.pattern('^\\+?[0-9. ()-]{7,25}$')]],
      contactEmail: ['', [Validators.required, Validators.email]],
      aboutMe: ['', [Validators.maxLength(500)]],
      specializationDetails: ['', [Validators.maxLength(500)]],
      workExperienceDetails: ['', [Validators.maxLength(500)]],
      furtherTraining: ['', [Validators.maxLength(500)]],
      achievementsAndAwards: ['', [Validators.maxLength(500)]],
      scientificWorks: ['', [Validators.maxLength(500)]],
      certificates: [null, [this.validateCertificates]]
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
        if (doctor.user.profileImage) { // Access profileImage from user
          this.profileImageUrl = 'data:image/jpeg;base64,' + doctor.user.profileImage;
        }
      },
      error: (error: any) => {
        console.error('Error loading organization profile:', error);
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

      this.doctorService.uploadProfileImage(formData).subscribe({
        next: (doctor: Doctor) => {
          this.doctorProfile = doctor;
          if (doctor['profileImage']) {
            this.profileImageUrl = 'data:image/jpeg;base64,' + doctor['profileImage'];
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

  submitVerification() {
    if (this.verificationForm.valid) {
      const formData = new FormData();
      const formValue = this.verificationForm.value;
      
      const dataWithoutCertificates = { ...formValue };
      delete dataWithoutCertificates.certificates;

      formData.append('data', new Blob([JSON.stringify(dataWithoutCertificates)], {
        type: "application/json"
      }));

      if (formValue.certificates) {
        for (let i = 0; i < formValue.certificates.length; i++) {
          formData.append('certificates', formValue.certificates[i]);
        }
      }

      this.doctorService.verifyDoctor(formData).subscribe({
        next: (response: Doctor) => {
          this.handleVerificationSuccess(response);
        },
        error: (error: any) => {
          this.handleVerificationError(error);
        }
      });
    } else {
      this.validateAllFormFields();
    }
  }

  private handleVerificationSuccess(response: Doctor) {
    this.doctorProfile = response;
    this.isVerified = true;
    this.verificationSuccess = 'Verification successful. Your profile has been updated.';
    this.verificationError = {};
    console.log('Verification successful', response);
    setTimeout(() => {
      this.router.navigate(['/doctor-dashboard']);
    }, 2000);
  }

  private handleVerificationError(error: any) {
    this.verificationSuccess = null;
    this.verificationError = {};

    if (error.error && error.error.validationErrors) {
      this.handleValidationErrors(error.error.validationErrors);
    } else if (error.error && error.error.error) {
      this.verificationError.general = error.error.error;
    } else if (error.error && error.error.businessErrorDescription) {
      this.verificationError.general = error.error.businessErrorDescription;
    } else {
      this.verificationError.general = 'An unexpected error occurred. Please try again.';
    }
    console.error('Error during verification:', error);
  }

  private handleValidationErrors(validationErrors: string[]) {
    const fieldMap: { [key: string]: string } = {
      'Specialization': 'speciality',
      'Education': 'education',
      'Current place of work': 'workPlace',
      'Position': 'position',
      'Work experience': 'workExperienceYears',
      'Awards': 'awards',
      'Contact Phone': 'contactPhone',
      'Contact Email': 'contactEmail',
      'About me': 'aboutMe',
      'Specialization details': 'specializationDetails',
      'Work experience details': 'workExperienceDetails',
      'Further training': 'furtherTraining',
      'Achievements and awards': 'achievementsAndAwards',
      'Scientific works': 'scientificWorks',
      'Certificates': 'certificates'
    };

    validationErrors.forEach((errorMsg: string) => {
      for (const [key, value] of Object.entries(fieldMap)) {
        if (errorMsg.includes(key)) {
          this.verificationError[value] = errorMsg;
          this.verificationForm.get(value)?.setErrors({ serverError: errorMsg });
          break;
        }
      }
    });
  }

  private validateAllFormFields() {
    Object.keys(this.verificationForm.controls).forEach(field => {
      const control = this.verificationForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
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

  validateCertificates(control: AbstractControl): {[key: string]: any} | null {
    const files = control.value as File[];
    if (files) {
      if (files.length > 5) {
        return { 'maxCount': true };
      }
      for (let file of files) {
        if (file.size > 5 * 1024 * 1024) { // 5MB in bytes
          return { 'maxSize': true };
        }
      }
    }
    return null;
  }
}
