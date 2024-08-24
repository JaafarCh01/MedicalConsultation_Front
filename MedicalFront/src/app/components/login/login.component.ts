import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/authService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ RouterModule, FormsModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          const role = this.authService.getUserRole();
          switch (role) {
            case 'DOCTOR':
              this.router.navigate(['/doctor-dashboard']);
              break;
            case 'PATIENT':
              this.router.navigate(['/patient-dashboard']);
              break;
            case 'ORGANIZATION':
              this.router.navigate(['/organization-dashboard']);
              break;
            default:
              this.router.navigate(['/']);
          }
        },
        error: (error) => {
          console.error('Login error', error);
          this.errorMessage = error.message || 'An error occurred during login';
        }
      });
    }
  }
}