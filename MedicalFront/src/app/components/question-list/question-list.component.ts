import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { AuthService } from '../../services/authService';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class QuestionListComponent implements OnInit {
  questions: any[] = [];
  questionForm: FormGroup;
  answerForm: FormGroup;
  showAskQuestion: boolean = false;
  isDoctor: boolean = false;

  constructor(
    private questionService: QuestionService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.questionForm = this.fb.group({
      category: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      keyword: ['', Validators.required]
    });
    this.answerForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.loadQuestions();
      this.isDoctor = this.authService.getUserRole() === 'DOCTOR';
    }
  }

  toggleAnswerForm(question: any) {
    question.showAnswerForm = !question.showAnswerForm;
  }

  onSubmitAnswer(questionId: number) {
    if (this.answerForm.valid) {
      const answerRequest = {
        questionId: questionId,
        content: this.answerForm.get('content')?.value
      };

      this.questionService.answerQuestion(answerRequest).subscribe({
        next: (response) => {
          console.log('Answer submitted successfully', response);
          this.answerForm.reset();
          this.loadQuestions(); // Reload questions to show the new answer
        },
        error: (error) => {
          console.error('Error submitting answer', error);
        }
      });
    }
  }

  loadQuestions() {
    this.questionService.getQuestions().subscribe({
      next: (questions) => {
        console.log('Received questions:', questions);
        this.questions = questions.map(q => ({
          ...q,
          patient: q.patient ? { 
            firstName: q.patient.firstName || 'Anonymous', 
            lastName: q.patient.lastName || '' 
          } : { firstName: 'Anonymous', lastName: '' },
          showAnswer: false
        }));
        console.log('Questions with patient data:', this.questions);
      },
      error: (error) => {
        console.error('Error loading questions', error);
      }
    });
  }

  onSubmit() {
    if (this.questionForm.valid) {
      console.log('Sending question:', this.questionForm.value);
      this.questionService.askQuestion(this.questionForm.value).subscribe({
        next: (response) => {
          console.log('Question asked successfully', response);
          this.questionForm.reset();
          this.loadQuestions(); // Reload questions after asking a new one
        },
        error: (error) => {
          console.error('Error asking question', error);
        }
      });
    }
  }

  toggleAskQuestion() {
    this.showAskQuestion = !this.showAskQuestion;
  }

  toggleAnswerView(question: any) {
    question.showAnswer = !question.showAnswer;
  }

 
}
