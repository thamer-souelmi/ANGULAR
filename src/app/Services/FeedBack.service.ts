import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { FeedBack } from "../Models/FeedBack";

@Injectable({
  providedIn: 'root'
})
export class FeedBackService {
  private feedBackUrl = 'http://localhost:8082/FeedBack-TrainingSession';

  constructor(private http: HttpClient) { }

  findAllFeedBacks(): Observable<FeedBack[]> {
    return this.http.get<FeedBack[]>(`${this.feedBackUrl}/findAllFeedBacks`).pipe(
      tap((feedbacks: FeedBack[]) => {
        console.log('Feedbacks:', feedbacks);
        feedbacks.forEach((feedback: FeedBack) => {
          console.log('FeedBack_date:', feedback.FeedBack_date);
        });
      }),
      catchError(this.handleError)
    );
  }

  findOneFeedBack(feedbackId: number): Observable<FeedBack> {
    return this.http.get<FeedBack>(`${this.feedBackUrl}/findOneFeedBack/${feedbackId}`).pipe(
      catchError(this.handleError)
    );
  }


  findAllFeedBacksForEvent(eventId: number): Observable<FeedBack[]> {
    return this.http.get<FeedBack[]>(`${this.feedBackUrl}/event/${eventId}`).pipe(
      catchError(this.handleError)
    );
  }

  updateFeedBack(feedBack: FeedBack): Observable<FeedBack> {
    return this.http.put<FeedBack>(`${this.feedBackUrl}/UpdateFeedBack`, feedBack).pipe(
      catchError(this.handleError)
    );
  }
  filterBadWords(text: string): string {
    const badWordsList = ['list', 'of', 'bad', 'words']; // À personnaliser
    let filteredText = text;
    badWordsList.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filteredText = filteredText.replace(regex, '****');
    });
    return filteredText;
  }
  getAverageRatingForEvent(eventId: number): Observable<number> {
    // Remplacez 'yourEndpoint' par le chemin correct exposé par votre backend
    const url = `${this.feedBackUrl}/event/${eventId}/averageRating`;
    return this.http.get<number>(url).pipe(
      catchError(this.handleError)
    );
  }
  addFeedback(eventId: number, text: string, note: number): Observable<any> {
    // Filtrer le texte pour les mots indésirables avant de l'envoyer
    const cleanText = this.filterBadWords(text);
    const urlWithEventId = `${this.feedBackUrl}/feedback/add/${eventId}`;
    const body = { description: cleanText, note: note }; // Note inclus dans le corps

    return this.http.post<any>(urlWithEventId, body).pipe(
      catchError(this.handleError)
    );
  }



  addFeedBack(feedBack: FeedBack): Observable<FeedBack> {
    return this.http.post<FeedBack>(`${this.feedBackUrl}/addFeedBack`, feedBack).pipe(
      catchError(this.handleError)
    );
  }

  deleteFeedBack(feedback_id: number): Observable<void> {
    return this.http.delete<void>(`${this.feedBackUrl}/deleteFeedBack/${feedback_id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong, please try again later.');
  }
}
