import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocardComponent } from '../docard/docard.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, DocardComponent, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  @Output() searchEvent = new EventEmitter<string>();
  @Output() filterEvent = new EventEmitter<string>();
  @Input() filteredCards: any[] = [];
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;

  onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchEvent.emit(searchTerm);
  }

  onFilter(event: Event) {
    const specialty = (event.target as HTMLSelectElement).value;
    this.filterEvent.emit(specialty);
  }

  onPageChange(page: number) {
    // Implement page change logic here
  }
}
