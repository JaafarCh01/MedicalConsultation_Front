import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from '../../services/authService';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from "rxjs";
import { Router } from '@angular/router';

interface User {
  firstname: string;
  email: string;
}

@Component({
  selector: "nav-bar",
  standalone: true,
  imports: [NgbModule, CommonModule, RouterModule],
  templateUrl: "./nav-bar.component.html",
  styleUrl: "./nav-bar.component.css",
})
export class NavBarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  user: User | null = null;
  userEmail: string = '';
  private authSubscription!: Subscription;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isLoggedIn = isAuthenticated;
        if (isAuthenticated) {
          const currentUser = this.authService.getCurrentUser();
          console.log('Current User:', currentUser); // Add this line for debugging
          if (currentUser) {
            this.user = { 
              firstname: currentUser.firstname || currentUser.firstName || '', 
              email: currentUser.email || '' 
            };
            this.userEmail = currentUser.email || '';
          }
        } else {
          this.user = null;
          this.userEmail = '';
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  getUserRole(): string {
    const role = this.authService.getUserRole();
    return role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleDropdown() {
    const dropdownContainer = document.getElementById('dropdownContainer');
    if (dropdownContainer) {
      dropdownContainer.classList.toggle('show');
    }
  }

  getDashboardLink(): string {
    const role = this.authService.getUserRole();
    switch (role?.toLowerCase()) {
      case 'doctor':
        return '/doctor-dashboard';
      case 'patient':
        return '/patient-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/dashboard';
    }
  }
}