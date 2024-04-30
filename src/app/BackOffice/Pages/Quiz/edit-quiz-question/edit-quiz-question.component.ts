import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuizQuestion } from "../../../../Models/quiz-question";
import { Option } from "../../../../Models/option";
import { QuizService } from "../../../../Services/quiz.service";

@Component({
  selector: 'app-edit-quiz-question',
  templateUrl: './edit-quiz-question.component.html',
  styleUrls: ['./edit-quiz-question.component.css']
})
export class EditQuizQuestionComponent {
  question: QuizQuestion;

  constructor(
    public dialogRef: MatDialogRef<EditQuizQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { question: QuizQuestion },
    private quizService: QuizService
  ) {
    // Initialize the question with the data passed in
    this.question = data.question;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submitQuestion(): void {
    this.quizService.editQuizQuestion(this.question.questionId, this.question).subscribe(
      response => {
        console.log('Question updated successfully', response);
        this.dialogRef.close();
      },
      error => {
        console.error('Error updating question', error);
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
