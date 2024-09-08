import { Component, OnInit } from '@angular/core';
import { DocardComponent } from '../../components/docard/docard.component';
import { SearchComponent } from '../../components/search/search.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../services/DoctorService';
import { Doctor } from '../../models/doctor.model';

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [DocardComponent, SearchComponent, PaginationComponent, CommonModule],
  templateUrl: './docs.component.html',
  styleUrl: './docs.component.css'
})
export class DocsComponent implements OnInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    this.fetchDoctors();
  }

  fetchDoctors() {
    this.doctorService.getAllDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        this.filterDoctors();
      },
      error: (error) => {
        console.error('Error fetching doctors:', error);
      }
    });
  }

  onSearch(searchTerm: string) {
    this.filterDoctors(searchTerm);
  }

  onFilter(specialty: string) {
    this.filterDoctors(undefined, specialty);
  }

  filterDoctors(searchTerm?: string, specialty?: string) {
    let filtered = this.doctors;

    if (searchTerm) {
      filtered = filtered.filter(doctor => 
        doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specialty && specialty !== 'All') {
      filtered = filtered.filter(doctor => doctor.speciality === specialty);
    }

    this.filteredDoctors = filtered;
    this.totalPages = Math.ceil(this.filteredDoctors.length / this.pageSize);
    this.currentPage = 1;
    this.updatePagedDoctors();
  }

  updatePagedDoctors() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredDoctors = this.filteredDoctors.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagedDoctors();
  }
}
