import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import {RegistrationEvent} from "../Models/RegistrationEvent";
import {tap} from "rxjs/operators";
import {EmailService} from "./email.service";

@Injectable({
  providedIn: 'root'
})
export class RegistrationEventService {
  private RegistrationEventUrl: string = 'http://localhost:8082/RegistrationEvent-TrainingSession/';

  constructor(private http: HttpClient,
              private EmailService: EmailService
  ) { }
  registerForEvent(eventId: number, userId: number): Observable<RegistrationEvent> {
    // Ensure the URL is correctly concatenated with a slash and includes the path variables
    const url = `${this.RegistrationEventUrl}addRegistrationEvent/${eventId}/${userId}`;
    // No need to pass a body in the POST request, so just use `null`
    return this.http.post<RegistrationEvent>(url, null, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }


  // registerForEvent(eventId: number, userId: number): Observable<any> {
  //   let newRegistration = new RegistrationEvent();
  //   newRegistration.user = { userId: userId };
  //   newRegistration.event = { eventId: eventId };
  //   return this.http.post<RegistrationEvent>(`${this.RegistrationEventUrl}addRegistrationEvent/${eventId}/${userId}`, newRegistration);
  // }

  findAllRegistrationEvent(): Observable<RegistrationEvent[]> {
    return this.http.get<RegistrationEvent[]>(this.RegistrationEventUrl + 'findAllRegistrationEvent');
  }

  findOneRegistrationEvent(registrationE_id:number): Observable<RegistrationEvent> {
    return this.http.get<RegistrationEvent>(this.RegistrationEventUrl + '/findOneRegistrationEvent/${registrationE_id}');
  }

  addRegistrationEvent(registrationEvent: RegistrationEvent): Observable<RegistrationEvent> {
    return this.http.post<RegistrationEvent>(this.RegistrationEventUrl + 'addRegistrationEvent', registrationEvent);
  }
  UpdateRegistrationEvent(registrationEvent: RegistrationEvent): Observable<RegistrationEvent> {
    return this.http.put<RegistrationEvent>(this.RegistrationEventUrl + 'UpdateRegistrationEvent', registrationEvent);
  }
  deleteRegistrationEvent(registrationE_id:number): Observable<void>{
    return this.http.delete<void>('${this.RegistrationEventUrl}/deleteRegistrationEvent/${registrationE_id}');
  }
}
