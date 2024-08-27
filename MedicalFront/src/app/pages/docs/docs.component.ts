import { Component, OnInit } from '@angular/core';
import { DocardComponent } from '../../components/docard/docard.component';
import { SearchComponent } from '../../components/search/search.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [DocardComponent, SearchComponent, PaginationComponent, CommonModule],
  templateUrl: './docs.component.html',
  styleUrl: './docs.component.css'
})
export class DocsComponent implements OnInit {
  cards = [
    { image: 'https://as2.ftcdn.net/v2/jpg/03/20/52/31/1000_F_320523164_tx7Rdd7I2XDTvvKfz2oRuRpKOPE5z0ni.jpg', name: 'Jaafar Cherkaoui', price: '50$ per consultation', specialty: 'Cardiology' },
    { image: 'https://as2.ftcdn.net/v2/jpg/02/60/04/09/1000_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg', name: 'Achraf Issiki', price: '40$ per consultation', specialty: 'Dermatology' },
    { image: 'https://as1.ftcdn.net/v2/jpg/02/40/58/88/1000_F_240588865_e81rl476gizNT8M7ogrU5YR3i0wln0qH.jpg', name: 'Ali Aitbelmous', price: '40$ per consultation', specialty: 'Neurology' },
    { image: 'https://as2.ftcdn.net/v2/jpg/03/36/01/25/1000_F_336012505_jcYVs9b7EEVKSfEvWTtOR0inmCugWnO6.jpg', name: 'Chick watermelon', price: '40$ per consultation', specialty: 'Pediatrics' },
    { image: 'https://as2.ftcdn.net/v2/jpg/01/74/68/73/1000_F_174687350_UWSczPocPvB0r9NAMkUHDpn0eKHQaB7v.jpg', name: 'Mekansi fassi', price: '50$ per consultation', specialty: 'Orthopedics' },
    { image: 'https://as2.ftcdn.net/v2/jpg/04/93/42/45/1000_F_493424533_RejfRmPCQ5qLv5z8FbDTLZvaF75zaMzP.jpg', name: 'tabla antinigga', price: '220$ per consultation', specialty: 'Psychiatry' },
  ];

  filteredCards: any[] = [];
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;

  ngOnInit() {
    this.filterCards();
  }

  onSearch(searchTerm: string) {
    this.filterCards(searchTerm);
  }

  onFilter(specialty: string) {
    this.filterCards(undefined, specialty);
  }

  filterCards(searchTerm?: string, specialty?: string) {
    let filtered = this.cards;

    if (searchTerm) {
      filtered = filtered.filter(card => 
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specialty && specialty !== 'All') {
      filtered = filtered.filter(card => card.specialty === specialty);
    }

    this.filteredCards = filtered;
    this.totalPages = Math.ceil(this.filteredCards.length / this.pageSize);
    this.currentPage = 1;
    this.updatePagedCards();
  }

  updatePagedCards() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredCards = this.filteredCards.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagedCards();
  }
}
