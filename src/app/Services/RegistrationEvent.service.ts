import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import {RegistrationEvent} from "../Models/RegistrationEvent";

@Injectable({
  providedIn: 'root'
})
export class RegistrationEventService {
  private RegistrationEventUrl: string = 'http://localhost:8082/RegistrationEvent-TrainingSession/';

  constructor(private http: HttpClient) { }
  registerForEvent(userId: number, eventId: number): Observable<RegistrationEvent> {
    // Assuming your backend expects something like this
    const registrationData = {
      registration_date: new Date(), // Assuming this is handled on the backend, you might not need to send it
      userId, // Directly sending userId
      eventId // Directly sending eventId
    };

    return this.http.post<RegistrationEvent>(`${this.RegistrationEventUrl}/register`, registrationData);
  }


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
