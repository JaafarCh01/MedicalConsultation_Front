import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationService } from '../../services/OrganizationService';
import { AuthService } from '../../services/authService';
import { Organization } from '../../models/organization.model';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-organization-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './organization-dashboard.component.html',
  styleUrl: './organization-dashboard.component.css'
})
export class OrganizationDashboardComponent implements OnInit {
  organizationProfile: any;
  profileForm: FormGroup;
  missingAttributes: string[] = [];
  activeSection: string = 'dashboard';
  isProfileComplete: boolean = false;
  showProfileForm: boolean = false;

  constructor(
    private organizationService: OrganizationService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.profileForm = this.formBuilder.group({
      organizationName: ['', Validators.required],
      typeOfInstitution: ['', Validators.required],
      description: ['', Validators.required],
      facilityCity: ['', Validators.required],
      facilityAddress: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      schedule: [''],
      website: [''],
      facilityEmailAddress: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {

    }
  }

 

  checkMissingAttributes() {
    this.missingAttributes = Object.keys(this.profileForm.controls).filter(
      key => !this.profileForm.get(key)?.value && this.profileForm.get(key)?.validator
    );
  }

  updateProfile() {
    if (!this.authService.isAuthenticated()) {
      console.error('User is not authenticated');
      return;
    }

    if (this.profileForm.valid) {
      this.organizationService.updateOrganization(this.profileForm.value).subscribe({
        next: (updatedOrganization: Organization) => {
          this.organizationProfile = updatedOrganization;
          this.checkMissingAttributes();
          console.log('Profile updated successfully', updatedOrganization);
        },
        error: (error: any) => {
          console.error('Error updating organization profile:', error);
        }
      });
    } else {
      console.log('Form is invalid', this.profileForm.errors);
    }
  }

  changeSection(section: string) {
    this.activeSection = section;
    if (section === 'profile') {

    }
  }

  formatFieldName(fieldName: string): string {
    const words = fieldName.split(/(?=[A-Z])/).map(word => word.toLowerCase());
    return words.join(' ');
  }
}
