import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { RegistrationService } from "../../services/RegistrationService";
import { RegistrationRequest } from "../../models/registration-request.model";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  selectedRole: string | null = null;
  registrationSuccess: string | null = null;

  doctorForm: FormGroup;
  patientForm: FormGroup;
  organizationForm: FormGroup;

  constructor(
    private router: Router,
    private registrationService: RegistrationService,
    private fb: FormBuilder,
  ) {
    this.doctorForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(1)]],
      lastName: ["", [Validators.required, Validators.minLength(1)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      dateOfBirth: ["", [Validators.required]],
      city: ["", [Validators.required]],
    });

    this.patientForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(1)]],
      lastName: ["", [Validators.required, Validators.minLength(1)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      dateOfBirth: ["", [Validators.required]],
      city: ["", [Validators.required]],
    });

    this.organizationForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(1)]],
      lastName: ["", [Validators.required, Validators.minLength(1)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      dateOfBirth: ["", [Validators.required]],
      city: ["", [Validators.required]],
      organizationName: ["", [Validators.required]],
      typeOfInstitution: ["", [Validators.required]],
      description: [""],
      facilityCity: ["", [Validators.required]],
      facilityAddress: ["", [Validators.required]],
      phoneNumber: ["", [Validators.required]],
      schedule: [""],
      website: [""],
      facilityEmailAddress: ["", [Validators.required, Validators.email]]
    });
  }

  selectRole(role: string) {
    this.selectedRole = role;
    this.registrationSuccess = null; // Reset success message when selecting a role
  }

  registerDoctor() {
    if (this.doctorForm.valid) {
      const registrationRequest: RegistrationRequest = this.doctorForm.value;
      this.registrationService.registerDoctor(registrationRequest).subscribe({
        next: (response) => {
          console.log("Doctor registered successfully", response);
          this.registrationSuccess = "Doctor registration complete!";
          this.doctorForm.reset();
        },
        error: (error) => {
          console.error("Error registering doctor", error);
        },
      });
    } else {
      console.log("Doctor form is invalid", this.doctorForm.errors);
    }
  }

  registerPatient() {
    if (this.patientForm.valid) {
      const registrationRequest: RegistrationRequest = this.patientForm.value;
      this.registrationService.registerPatient(registrationRequest).subscribe({
        next: (response) => {
          console.log("Patient registered successfully", response);
          this.registrationSuccess = "Patient registration complete!";
          this.patientForm.reset();
        },
        error: (error) => {
          console.error("Error registering patient", error);
        },
      });
    } else {
      console.log("Patient form is invalid", this.patientForm.errors);
    }
  }

  registerOrganization() {
    if (this.organizationForm.valid) {
      const registrationRequest: RegistrationRequest = this.organizationForm.value;
      this.registrationService.registerOrganization(registrationRequest).subscribe({
        next: (response) => {
          console.log("Organization registered successfully", response);
          this.registrationSuccess = "Organization registration complete!";
          this.organizationForm.reset();
        },
        error: (error) => {
          console.error("Error registering organization", error);
        },
      });
    } else {
      console.log("Organization form is invalid", this.organizationForm.errors);
    }
  }
}