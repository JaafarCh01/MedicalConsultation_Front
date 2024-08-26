import { Component } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from '../../services/authService';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: "nav-bar",
  standalone: true,
  imports: [NgbModule, CommonModule, RouterModule],
  templateUrl: "./nav-bar.component.html",
  styleUrl: "./nav-bar.component.css",
})
export class NavBarComponent {
  constructor(public authService: AuthService, private router: Router) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getUserRole(): string | null {
    return this.authService.getUserRole();
  }

  getUserName(): string {
    const user = this.authService.getCurrentUser();
    return user && user.firstName ? `${user.firstName} ${user.lastName}` : '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}