import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ RouterModule , CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  selectedRole: string | null = null;
  doctor = {
    firstName: '',
    lastName: '',
    email: '',
    specialty: '',
    password: '',
    confirmPassword: ''
  };
  patient = {
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private router: Router) {}

  selectRole(role: string) {
    this.selectedRole = role;
  }

  registerDoctor() {
    // Add logic for doctor registration
    console.log('Doctor Registration', this.doctor);
  }

  registerPatient() {
    // Add logic for patient registration
    console.log('Patient Registration', this.patient);
  }
}
