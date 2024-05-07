import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import { Injectable } from "@angular/core";
import {TrainingSession} from "../Models/TrainingSession";
import {catchError, map, tap} from "rxjs/operators";
import {Room} from "../Models/Room";
import {TS_Status} from "../Models/TS_Status";
import {RegistrationTS} from "../Models/RegistrationTS";
import {User} from "../Models/User";

@Injectable({
  providedIn: 'root'
})
export class TrainingSessionService {
  private TrainingSessionUrl: string = 'http://localhost:8082/TrainingSession-TrainingSession/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  findAllRegistrationTS(page: number, size: number): Observable<any> {
    console.log(`Requesting page ${page} with size ${size}`);
    return this.http.get<any>(`${this.TrainingSessionUrl}findAllTrainingSession?page=${page}&size=${size}`, { responseType: 'json' })
      .pipe(
        tap(response => console.log(`Received response for page ${page} with size ${size}:`, response)),
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching training sessions', error);
          return throwError(() => new Error('Failed to load training sessions'));
        })
      );
  }

  findOneTrainingSession(ts_id: number): Observable<TrainingSession> {
    return this.http.get<TrainingSession>(`${this.TrainingSessionUrl}findOneTrainingSession/${ts_id}`);
  }

  // addTrainingSession(sessionData: any, roomId?: number): Observable<any> {
  //   const url = roomId ? `${this.TrainingSessionUrl}addTrainingSession/${roomId}` : `${this.TrainingSessionUrl}addTrainingSession`;
  //
  //   return this.http.post(url, sessionData, {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     })
  //   }).pipe(
  //     catchError(error => {
  //       console.error('Error occurred:', error);
  //       return throwError(() => new Error('An error occurred while sending data to the server.'));
  //     })
  //   );
  // }
  // addTrainingSessionWithoutRoom(sessionData: TrainingSession): Observable<TrainingSession> {
  //   return this.http.post<TrainingSession>(`${this.TrainingSessionUrl}addTrainingSession`, sessionData);
  // }
  // addTrainingSessionWithRoom(sessionData: TrainingSession, roomId: number): Observable<TrainingSession> {
  //   const url = `${this.TrainingSessionUrl}addTrainingSession/${roomId}`;
  //   return this.http.post<TrainingSession>(url, sessionData);
  // }

  addTrainingSessionWithRoom(trainingSession: TrainingSession, roomId: number, trainerId: number): Observable<TrainingSession> {
    const url = `${this.TrainingSessionUrl}with-room/${roomId}/${trainerId}`;
    return this.http.post<TrainingSession>(url, trainingSession, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('Failed to add training session with room:', error);
          return throwError(() => new Error('Failed to send request'));
        })
      );
  }

  addTrainingSessionWithoutRoom(trainingSession: TrainingSession, trainerId: number): Observable<TrainingSession> {
    const url = `${this.TrainingSessionUrl}without-room/${trainerId}`;
    console.log('Sending data:', JSON.stringify(trainingSession));
    return this.http.post<TrainingSession>(url, trainingSession, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      console.error('A client-side or network error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
      errorMessage = `Error: ${error.status}, ${error.message}, ${error.error}`;
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
  updateTrainingSessionStatus(sessionId: number, status: TS_Status): Observable<any> {
    const payload = status; // Send status as a plain string
    return this.http.patch(`${this.TrainingSessionUrl}${sessionId}/status`, payload, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );

  }

  getUsersByTrainingSession(sessionId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.TrainingSessionUrl}${sessionId}/users`);
  }
  registerUserToSession(sessionId: number, userId: number): Observable<RegistrationTS> {
    return this.http.post<RegistrationTS>(`${this.TrainingSessionUrl}/${sessionId}/register/${userId}`, {});
  }




}
