import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class QuestionListComponent implements OnInit {
  questions: any[] = [];

  constructor(private questionService: QuestionService) { }
  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.loadQuestions();
    }
  }
  loadQuestions() {
    this.questionService.getQuestions().subscribe(
      questions => {
        this.questions = questions;
      },
      error => {
        console.error('Error loading questions', error);
      }
    );
  }
}
