import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import { Injectable } from "@angular/core";
import {TrainingSession} from "../Models/TrainingSession";
import {catchError} from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class TrainingSessionService {
  private TrainingSessionUrl: string = 'http://localhost:8082/TrainingSession-TrainingSession/';

  constructor(private http: HttpClient) { }

  findAllRegistrationTS(): Observable<TrainingSession[]> {
    return this.http.get<TrainingSession[]>(`${this.TrainingSessionUrl}findAllTrainingSession`);
  }

  findOneTrainingSession(TS_id: number): Observable<TrainingSession> {
    return this.http.get<TrainingSession>(`${this.TrainingSessionUrl}findOneTrainingSession/${TS_id}`);
  }

  addTrainingSession(trainingSession: TrainingSession): Observable<TrainingSession> {
    return this.http.post<TrainingSession>(`${this.TrainingSessionUrl}addTrainingSession`, trainingSession).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle HTTP errors here
        return throwError(() => new Error('Failed to add training session: ' + error.message));
      })
    );
  }
  UpdateTrainingSession(trainingSession: TrainingSession): Observable<TrainingSession> {
    return this.http.put<TrainingSession>(`${this.TrainingSessionUrl}UpdateTrainingSession`, trainingSession);
  }
  deleteTrainingSessionById(TS_id: number): Observable<void>{
    return this.http.delete<void>(`${this.TrainingSessionUrl}deleteTrainingSessionById/${TS_id}`);
  }
}
