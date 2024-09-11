import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationService } from '../../services/OrganizationService';
import { AuthService } from '../../services/authService';
import { Organization } from '../../models/organization.model';
import { isPlatformBrowser } from '@angular/common';
import { OrganizationTypes } from '../../models/organization-types';
import { OrganizationTypesDisplay } from '../../models/organization-types-display';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organization-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './organization-dashboard.component.html',
  styleUrl: './organization-dashboard.component.css'
})
export class OrganizationDashboardComponent implements OnInit {
  organizationProfile: Organization | null = null;
  verificationForm: FormGroup;
  activeSection: string = 'dashboard';
  isVerified: boolean = false;
  organizationTypes = Object.values(OrganizationTypes);
  organizationTypesDisplay = OrganizationTypesDisplay;
  verificationError: any = {};
  verificationSuccess: string | null = null;

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.verificationForm = this.fb.group({
      organizationName: ['', [Validators.required]],
      typeOfInstitution: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(50)]],
      facilityCity: ['', [Validators.required]],
      facilityAddress: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\+?[0-9. ()-]{7,25}$')]],
      schedule: [''],
      website: ['', [Validators.maxLength(100)]],
      facilityEmailAddress: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadOrganizationProfile();
    }
  }

  loadOrganizationProfile() {
    this.organizationService.getOrganizationProfile().subscribe({
      next: (organization: Organization) => {
        this.organizationProfile = organization;
        this.isVerified = organization.verified;
        if (this.isVerified) {
          this.verificationForm.patchValue(organization);
        }
      },
      error: (error: any) => {
        console.error('Error loading organization profile:', error);
      }
    });
  }

  submitVerification() {
    if (this.verificationForm.valid) {
      const formValue = this.verificationForm.value;

      this.organizationService.verifyOrganization(formValue).subscribe({
        next: (response: Organization) => {
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

  private handleVerificationSuccess(response: Organization) {
    this.organizationProfile = response;
    this.isVerified = true;
    this.verificationSuccess = 'Verification successful. Your profile has been updated.';
    this.verificationError = {};
    console.log('Verification successful', response);
    setTimeout(() => {
      this.router.navigate(['/organization-dashboard']);
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
      'Organization name': 'organizationName',
      'Type of institution': 'typeOfInstitution',
      'Description': 'description',
      'Facility city': 'facilityCity',
      'Facility address': 'facilityAddress',
      'Phone number': 'phoneNumber',
      'Schedule': 'schedule',
      'Website': 'website',
      'Facility email address': 'facilityEmailAddress'
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
      this.loadOrganizationProfile();
    }
  }

  formatFieldName(fieldName: string): string {
    const words = fieldName.split(/(?=[A-Z])/).map(word => word.toLowerCase());
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
}
