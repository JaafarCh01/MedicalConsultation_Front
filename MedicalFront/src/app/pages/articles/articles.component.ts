import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleCardComponent } from '../../components/article-card/article-card.component';
import { SearchComponent } from '../../components/search/search.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [ArticleCardComponent, SearchComponent, PaginationComponent, CommonModule, RouterModule],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.css'
})
export class ArticlesComponent implements OnInit {
  articles = [
    { id: 1, title: 'Article 1', author: 'Author 1', date: '2023-01-01', summary: 'Summary of article 1', category: 'Cardiology' },
    { id: 2, title: 'Article 2', author: 'Author 2', date: '2023-02-01', summary: 'Summary of article 2', category: 'Dermatology' },
    { id: 3, title: 'Article 3', author: 'Author 3', date: '2023-03-01', summary: 'Summary of article 3', category: 'Neurology' },
    { id: 4, title: 'Article 4', author: 'Author 4', date: '2023-04-01', summary: 'Summary of article 4', category: 'Pediatrics' },
    { id: 5, title: 'Article 5', author: 'Author 5', date: '2023-05-01', summary: 'Summary of article 5', category: 'Orthopedics' },
    { id: 6, title: 'Article 6', author: 'Author 6', date: '2023-06-01', summary: 'Summary of article 6', category: 'Psychiatry' },
    { id: 7, title: 'Article 7', author: 'Author 7', date: '2023-07-01', summary: 'Summary of article 7', category: 'Oncology' },
    { id: 8, title: 'Article 8', author: 'Author 8', date: '2023-08-01', summary: 'Summary of article 8', category: 'Radiology' },
    { id: 9, title: 'Article 9', author: 'Author 9', date: '2023-09-01', summary: 'Summary of article 9', category: 'Gastroenterology' },
    { id: 10, title: 'Article 10', author: 'Author 10', date: '2023-10-01', summary: 'Summary of article 10', category: 'Endocrinology' },
    { id: 11, title: 'Article 11', author: 'Author 11', date: '2023-11-01', summary: 'Summary of article 11', category: 'Hematology' },
    { id: 12, title: 'Article 12', author: 'Author 12', date: '2023-12-01', summary: 'Summary of article 12', category: 'Nephrology' },
  ];

  filteredArticles: any[] = [];
  displayedArticles: any[] = [];
  currentPage = 1;
  pageSize = 9;
  totalPages = 1;

  ngOnInit() {
    this.filterArticles();
  }

  onSearch(searchTerm: string) {
    this.filterArticles(searchTerm);
  }

  onFilter(filter: string) {
    this.filterArticles(undefined, filter);
  }

  filterArticles(searchTerm?: string, filter?: string) {
    let filtered = this.articles;

    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter && filter !== 'All') {
      filtered = filtered.filter(article => article.category === filter);
    }

    this.filteredArticles = filtered;
    this.totalPages = Math.ceil(this.filteredArticles.length / this.pageSize);
    this.currentPage = 1;
    this.updatePagedArticles();
  }

  updatePagedArticles() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedArticles = this.filteredArticles.slice(startIndex, endIndex);
  
    // Fill the remaining slots with empty placeholders
    while (this.displayedArticles.length < this.pageSize) {
      this.displayedArticles.push({ id: null, title: '', author: '', date: '', summary: '', category: '' });
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagedArticles();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }
}
