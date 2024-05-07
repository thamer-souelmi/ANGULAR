import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import { Injectable } from "@angular/core";
import {RegistrationTS} from "../Models/RegistrationTS";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RegistrationTSService {
  private RegistrationTSUrl: string = 'http://localhost:8082/RegistrationTS-TrainingSession/';

  constructor(private http: HttpClient) { }

  findAllRegistrationTS(): Observable<RegistrationTS[]> {
    return this.http.get<RegistrationTS[]>(this.RegistrationTSUrl + 'findAllRegistrationTS');
  }

  findOneRegistrationTS(registrationTS_id:number): Observable<RegistrationTS> {
    return this.http.get<RegistrationTS>(this.RegistrationTSUrl + '/findOneRegistrationTS/${registrationTS_id}');
  }

  addRegistrationTS(registrationTS: RegistrationTS): Observable<RegistrationTS> {
    return this.http.post<RegistrationTS>(this.RegistrationTSUrl + 'addRegistrationTS', registrationTS);
  }
  UpdateRegistrationTS(registrationTS: RegistrationTS): Observable<RegistrationTS> {
    return this.http.put<RegistrationTS>(this.RegistrationTSUrl + 'UpdateRegistrationTS', registrationTS);
  }
  deleteRegistrationTS(registrationTS_id:number): Observable<void>{
    return this.http.delete<void>('${this.RegistrationTSUrl}/deleteRegistrationTS/${registrationTS_id}');
  }
  // registerForTraining(tsId: number, userId: number){
  //   return this.http.post(`${this.RegistrationTSUrl}addRegistrationTS/${tsId}/${userId}`,null, {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     })
  //   });
  //
  // }
  registerForTraining(tsId: number, userId: number): Observable<any> {
    return this.http.post(`${this.RegistrationTSUrl}addRegistrationTS/${tsId}/${userId}`, null, {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} ${error.statusText}`;
      if (error.status === 409) {
        errorMessage = "This session is already full!";
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  unregisterFromTraining(tsId: number, userId: number) {
    // Assuming you have an API endpoint to handle unregistration
    return this.http.post(`/api/unregister/${tsId}`, { userId });
  }

}
