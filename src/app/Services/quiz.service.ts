import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {QuizQuestion} from "../Models/quiz-question";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  urlQuiz: string = "http://localhost:8082/quiz";


  constructor(private http: HttpClient) { }
  addQuizQuestion(quizQuestion: QuizQuestion): Observable<QuizQuestion> {
    return this.http.post<QuizQuestion>(`${this.urlQuiz}/add`, quizQuestion);
  }
  getAllQuizQuestions(): Observable<QuizQuestion[]> {
    return this.http.get<QuizQuestion[]>(`${this.urlQuiz}/questions`);
  }
  deleteQuizQuestion(questionId: number): Observable<any> {
    return this.http.delete(`${this.urlQuiz}/delete/${questionId}`);
  }
  editQuizQuestion(questionId: number, updatedQuizQuestion: QuizQuestion): Observable<QuizQuestion> {
    return this.http.put<QuizQuestion>(`${this.urlQuiz}/edit/${questionId}`, updatedQuizQuestion);
  }
}


