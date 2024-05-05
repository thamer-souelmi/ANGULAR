import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import {RegistrationTS} from "../Models/RegistrationTS";

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
  registerForTraining(tsId: number, userId: number){
    return this.http.post(`${this.RegistrationTSUrl}addRegistrationTS/${tsId}/${userId}`,null, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });

  }

}
