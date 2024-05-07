import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {QuizQuestion} from "../../../../Models/quiz-question";
import {Option} from "../../../../Models/option";
import {QuizService} from "../../../../Services/quiz.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-add-quiz-question',
  templateUrl: './add-quiz-question.component.html',
  styleUrls: ['./add-quiz-question.component.css']
})
export class AddQuizQuestionComponent {
  question: QuizQuestion = {
    questionId: 0,
    question: '',
    options: [
      { answer: '', correct: false },
      { answer: '', correct: false },
      { answer: '', correct: false },
      { answer: '', correct: false }
    ]
  };
  constructor(
    public dialogRef: MatDialogRef<AddQuizQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private quizService: QuizService,private toastr: ToastrService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  submitQuestion(): void {
    this.quizService.addQuizQuestion(this.question).subscribe(
      response => {
        console.log('Question added successfully', response);
        this.toastr.success('Quiz question added successfully!', 'Success');
        this.dialogRef.close();
      },
      error => {
        console.error('Error adding question', error);
        // Handle error appropriately, e.g., show a message to the user
      }
    );
  }
  isQuestionEmpty(): boolean {
    return !this.question.question.trim();
  }

  isOptionEmpty(option: Option): boolean {
    return !option.answer.trim();
  }

  isFormInvalid(): boolean {
    return this.isQuestionEmpty() || this.question.options.some(option => this.isOptionEmpty(option));
  }
}
