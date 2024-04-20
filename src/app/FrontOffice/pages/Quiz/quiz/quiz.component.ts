import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent  implements OnInit{
  showWarning: boolean = false;

  isQuizStarted: boolean = false;
  isQuizEnded: boolean = false;
  questionsList: any[]= [];
  currentQuestionNo: number = 0;

  remainingTime:number = 10;

  timer = interval(1000);
  subscription: Subscription [] = [];
  correctAnswerCount: number = 0;

  constructor(private http: HttpClient) {}


  ngOnInit(): void {
    this.loadQuestions();
  }
  loadQuestions() {
    this.http.get("assets/FrontOffice/questions.json").subscribe((res:any)=>{
      debugger;
      this.questionsList = res;
    })
  }
  nextQuestion() {
    if (this.currentQuestionNo < this.questionsList.length - 1) {
      this.currentQuestionNo++;
    } else {
      this.subscription.forEach(element => {
        element.unsubscribe();
      });
    }
    console.log('Current question number:', this.currentQuestionNo);
    console.log('Total number of questions:', this.questionsList.length);
  }

  finish() {
    this.isQuizEnded = true;
    this.isQuizStarted = false;
  }

  start() {
    this.showWarning = false;
    this.isQuizEnded = false;
    this.isQuizStarted = false;
  }

  showWarningPopup() {
    this.showWarning = true;
  }

  selectOption(option: any) {
    if(option.isCorrect) {
      this.correctAnswerCount ++;
    }
    option.isSelected = true;
    // Update the isQuizEnded flag if the current question is the last one
    if (this.currentQuestionNo === this.questionsList.length - 1) {
      this.isQuizEnded = true;
    }
  }

  isOptionSelected(options: any) {
    const selectionCount = options.filter((m:any)=>m.isSelected == true).length;
    if(selectionCount == 0) {
      return false;
    } else {
      return true;
    }
  }
  startQuiz() {
    this.showWarning = false;
    this.isQuizStarted = true;
   this.subscription.push(this.timer.subscribe(res=> {
      console.log(res);
      if(this.remainingTime != 0) {
        this.remainingTime --;
      }
      if(this.remainingTime == 0) {
        this.nextQuestion();
        this.remainingTime = 10;
      }
    })
   )
  }
}
