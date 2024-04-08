import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Activity } from "../Models/Activity";
import { Injectable } from "@angular/core";
import { Event } from "../Models/Event";
// import {FormGroupRawValue, GetProperty, TypedOrUntyped} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private ActivityUrl: string = 'http://localhost:8082/Activity-TrainingSession/';

  constructor(private http: HttpClient) { }

  findAllActivities(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.ActivityUrl}findAllActivities?page=${page}&size=${size}`).pipe(
      catchError(this.handleError)
    );
  }



  findOneActivity(activityId: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.ActivityUrl}findOneActivity/${activityId}`).pipe(
      catchError(this.handleError)
    );
  }


  updateActivity(activity: Activity, event_id: number): Observable<Activity> {
    // Construisez correctement l'URL avec `activity_id` et `event_id`.
    const url = `${this.ActivityUrl}updateActivity/${activity.activity_id}/${event_id}`;
    return this.http.put<Activity>(url, activity)
      .pipe(catchError(this.handleError));
  }

  // addActivity(activity: Activity, event_id: number): Observable<Activity> {
  //   console.log('Adding activity:', activity);
  //   // Make sure the event_id is properly included in the URL
  //   return this.http.post<Activity>(`${this.ActivityUrl}addActivity/${event_id}`, activity).pipe(
  //     catchError(this.handleError)
  //   );
  // }

// In ActivityService
  addActivity(activity: Partial<Activity>, event_id: number): Observable<Activity> {
    const url = `http://localhost:8082/Activity-TrainingSession/addActivity/${event_id}`;
    return this.http.post<Activity>(url, activity).pipe(
      catchError(this.handleError)
    );
  }


  deleteActivity(activity_id: number): Observable<void> {
    return this.http.delete<void>(`${this.ActivityUrl}deleteActivityById?activity_id=${activity_id}`).pipe(
      catchError(this.handleError)
    );
  }

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.ActivityUrl + 'getAllEvents').pipe(
      catchError(this.handleError)
    );
  }

  getAllEventsWithName(): Observable<Event[]> {
    return this.http.get<Event[]>(this.ActivityUrl + 'getAllEventsWithName').pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      console.error('An error occurred:', error.error.message);
    } else {
      // Erreur côté serveur
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Retourne une observable avec un message d'erreur convivial
    return throwError(
      'Something bad happened; please try again later.');
  }

  searchActivities(keywords?: string, startDate?: string, endDate?: string): Observable<Activity[]> {
    let params = new HttpParams();
    if (keywords) params = params.append('keywords', keywords);
    if (startDate) params = params.append('startDate', startDate);
    if (endDate) params = params.append('endDate', endDate);

    return this.http.get<Activity[]>(`${this.ActivityUrl}/search`, { params });
  }
}
