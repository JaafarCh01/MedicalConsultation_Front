import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationCardComponent } from '../../components/organization-card/organization-card.component';
import { SearchComponent } from '../../components/search/search.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-organisations',
  standalone: true,
  imports: [OrganizationCardComponent, SearchComponent, PaginationComponent, CommonModule],
  templateUrl: './organisations.component.html',
  styleUrls: ['./organisations.component.css']
})
export class OrganizationsComponent implements OnInit {
  organizations = [
    { name: 'Organization 1', type: 'Hospital', city: 'City 1', address: 'Address 1' },
    { name: 'Organization 2', type: 'Clinic', city: 'City 2', address: 'Address 2' },
    { name: 'Organization 3', type: 'Health Center', city: 'City 3', address: 'Address 3' },
    { name: 'Organization 4', type: 'Hospital', city: 'City 4', address: 'Address 4' },
    { name: 'Organization 5', type: 'Clinic', city: 'City 5', address: 'Address 5' },
    { name: 'Organization 6', type: 'Health Center', city: 'City 6', address: 'Address 6' },
  ];

  filteredOrganizations: any[] = [];
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;

  ngOnInit() {
    this.filterOrganizations();
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
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (type && type !== 'All') {
      filtered = filtered.filter(org => org.type === type);
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