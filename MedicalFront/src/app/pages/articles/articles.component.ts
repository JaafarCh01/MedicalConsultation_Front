import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCardComponent } from '../../components/article-card/article-card.component';
import { SearchComponent } from '../../components/search/search.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [ArticleCardComponent, SearchComponent, PaginationComponent, CommonModule],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.css'
})
export class ArticlesComponent implements OnInit {
  articles = [
    { title: 'Article 1', author: 'Author 1', date: '2023-01-01', summary: 'Summary of article 1', category: 'Cardiology' },
    { title: 'Article 2', author: 'Author 2', date: '2023-02-01', summary: 'Summary of article 2', category: 'Dermatology' },
    { title: 'Article 3', author: 'Author 3', date: '2023-03-01', summary: 'Summary of article 3', category: 'Neurology' },
    { title: 'Article 4', author: 'Author 4', date: '2023-04-01', summary: 'Summary of article 4', category: 'Pediatrics' },
    { title: 'Article 5', author: 'Author 5', date: '2023-05-01', summary: 'Summary of article 5', category: 'Orthopedics' },
    { title: 'Article 6', author: 'Author 6', date: '2023-06-01', summary: 'Summary of article 6', category: 'Psychiatry' },
  ];

  filteredArticles: any[] = [];
  currentPage = 1;
  pageSize = 6;
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
    this.filteredArticles = this.filteredArticles.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagedArticles();
  }
}
