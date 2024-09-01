import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from '../../services/authService';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from "rxjs";
import { Router } from '@angular/router';

@Component({
  selector: "nav-bar",
  standalone: true,
  imports: [NgbModule, CommonModule, RouterModule],
  templateUrl: "./nav-bar.component.html",
  styleUrl: "./nav-bar.component.css",
})
export class NavBarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  userName: string = '';
  userEmail: string = '';
  private authSubscription!: Subscription;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isLoggedIn = isAuthenticated;
        if (isAuthenticated) {
          const user = this.authService.getCurrentUser();
          console.log('User:', user); // Debugging line
          this.userName = user && user.firstName ? `${user.firstName} ${user.lastName}` : 'User';
          console.log('UserName:', this.userName); // Debugging line
          this.userEmail = user ? user.email : '';
        } else {
          this.userName = '';
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

  getUserRole(): string | null {
    return this.authService.getUserRole();
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
}