import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationCardComponent } from '../../components/organization-card/organization-card.component';
import { SearchComponent } from '../../components/search/search.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { OrganizationService } from '../../services/OrganizationService';
import { Organization } from '../../models/organization.model';

@Component({
  selector: 'app-organisations',
  standalone: true,
  imports: [OrganizationCardComponent, SearchComponent, PaginationComponent, CommonModule],
  templateUrl: './organisations.component.html',
  styleUrls: ['./organisations.component.css']
})
export class OrganizationsComponent implements OnInit {
  organizations: Organization[] = [];
  filteredOrganizations: Organization[] = [];
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;

  constructor(private organizationService: OrganizationService) {}

  ngOnInit() {
    this.fetchOrganizations();
  }

  fetchOrganizations() {
    this.organizationService.getAllOrganizations().subscribe({
      next: (organizations) => {
        this.organizations = organizations;
        this.filterOrganizations();
      },
      error: (error) => {
        console.error('Error fetching organizations:', error);
      }
    });
  }

  onSearch(searchTerm: string) {
    this.filterOrganizations(searchTerm);
  }

  onFilter(type: string) {
    this.filterOrganizations(undefined, type);
  }

  filterOrganizations(searchTerm?: string, type?: string) {
    let filtered = this.organizations;

    if (searchTerm) {
      filtered = filtered.filter(org => 
        org.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.typeOfInstitution.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (type && type !== 'All') {
      filtered = filtered.filter(org => org.typeOfInstitution === type);
    }

    this.filteredOrganizations = filtered;
    this.totalPages = Math.ceil(this.filteredOrganizations.length / this.pageSize);
    this.currentPage = 1;
    this.updatePagedOrganizations();
  }

  updatePagedOrganizations() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredOrganizations = this.filteredOrganizations.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagedOrganizations();
  }
}