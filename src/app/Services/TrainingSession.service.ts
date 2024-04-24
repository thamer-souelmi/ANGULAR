import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import { Injectable } from "@angular/core";
import {TrainingSession} from "../Models/TrainingSession";
import {catchError, map} from "rxjs/operators";
import {Room} from "../Models/Room";

@Injectable({
  providedIn: 'root'
})
export class TrainingSessionService {
  private TrainingSessionUrl: string = 'http://localhost:8082/TrainingSession-TrainingSession/';

  constructor(private http: HttpClient) { }

  findAllRegistrationTS(): Observable<TrainingSession[]> {
    return this.http.get<string>(this.TrainingSessionUrl + 'findAllTrainingSession', { responseType: 'text' as 'json' })
      .pipe(
        map(response => {
          try {
            return JSON.parse(response);
          } catch (e) {
            console.error('Error parsing JSON:', e);
            return []; // Retourner un tableau vide ou une valeur par défaut si le JSON est incorrect
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching training sessions', error);
          return throwError(() => new Error('Failed to load training sessions'));
        })
      );
  }

  // findAllRegistrationTS(): Observable<TrainingSession[]> {
  //   return this.http.get<TrainingSession[]>(this.TrainingSessionUrl + 'findAllTrainingSession', { responseType: 'json' })
  //     .pipe(
  //       catchError((error: HttpErrorResponse) => {
  //         if (error.error instanceof ErrorEvent) {
  //           // Client-side or network error
  //           console.error("Client-side error:", error.error.message);
  //         } else {
  //           // Backend returned an unsuccessful response code
  //           console.error(`Backend returned code ${error.status}, body was: `, error.error);
  //         }
  //         return throwError(() => new Error('Error fetching training sessions, unable to load data.'));
  //       })
  //     );
  // }



  findOneTrainingSession(ts_id: number): Observable<TrainingSession> {
    return this.http.get<TrainingSession>(`${this.TrainingSessionUrl}findOneTrainingSession/${ts_id}`);
  }

  addTrainingSession(sessionData: any, roomId: number): Observable<any> {
    const url = `${this.TrainingSessionUrl}addTrainingSession/${roomId}`;
    return this.http.post(url, sessionData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: any) {
    let errorMessage = 'Unknown error!';
    if (error) {
      errorMessage = `Error: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  UpdateTrainingSession(trainingSession: TrainingSession): Observable<TrainingSession> {
    return this.http.put<TrainingSession>(`${this.TrainingSessionUrl}UpdateTrainingSession`, trainingSession);
  }
  deleteTrainingSessionById(ts_id: number): Observable<void> {
    return this.http.delete<void>(`${this.TrainingSessionUrl}deleteTrainingSessionById/${ts_id}`);
  }
  getAvailableRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.TrainingSessionUrl}rooms/available`);
  }
}
