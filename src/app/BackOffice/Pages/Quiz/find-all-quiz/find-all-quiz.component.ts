import {Component, OnInit} from '@angular/core';
import {QuizQuestion} from "../../../../Models/quiz-question";
import {QuizService} from "../../../../Services/quiz.service";
import { MatDialog } from '@angular/material/dialog';
import {AddQuizQuestionComponent} from "../add-quiz-question/add-quiz-question.component";
import {EditQuizQuestionComponent} from "../edit-quiz-question/edit-quiz-question.component";

@Component({
  selector: 'app-find-all-quiz',
  templateUrl: './find-all-quiz.component.html',
  styleUrls: ['./find-all-quiz.component.css']
})
export class FindAllQuizComponent implements OnInit {
  quizQuestions: QuizQuestion[] = [];

  constructor(private quizService: QuizService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.quizService.getAllQuizQuestions().subscribe(questions => {
      this.quizQuestions = questions;
      console.log(JSON.stringify(this.quizQuestions, null, 2)); // Log the full structure
    });
    this.fetchQuizQuestions();

  }


  fetchQuizQuestions(): void {
    this.quizService.getAllQuizQuestions().subscribe(
      questions => {
        this.quizQuestions = questions;
      },
      error => {
        console.error('Error fetching quiz questions', error);
        // Handle error appropriately, e.g., show a message to the user
      }
    );
  }

  flipCard(eventTarget: EventTarget | null) {
    const card = eventTarget as HTMLElement;
    if (card) {
      card.classList.toggle('is-flipped');
    }
  }

  openAddQuizQuestionDialog(): void {
    const dialogRef = this.dialog.open(AddQuizQuestionComponent, {
      width: '600px',
      data: {} // Pass any data you need to the dialog here
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle the result of the dialog here
      // Optionally, refresh the list of quiz questions
      this.refreshQuizQuestions();
    });
  }

  deleteQuizQuestion(questionId: number): void {
    this.quizService.deleteQuizQuestion(questionId).subscribe(() => {
      console.log('Quiz question deleted successfully');
      // Refresh the list of quiz questions after deletion
      this.refreshQuizQuestions();
    }, error => {
      console.error('Error deleting quiz question', error);
      // Handle error appropriately, e.g., show a message to the user
    });
  }

  private refreshQuizQuestions(): void {
    this.quizService.getAllQuizQuestions().subscribe(questions => {
      this.quizQuestions = questions;
    });
  }
  openEditQuizQuestionDialog(question: QuizQuestion): void {
    const dialogRef = this.dialog.open(EditQuizQuestionComponent, {
      width: '600px',
      data: { question: question } // Pass the quiz question to be edited
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Optionally, refresh the list of quiz questions
      this.fetchQuizQuestions();
    });
  }
}
