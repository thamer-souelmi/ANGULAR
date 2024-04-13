import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Event } from "../Models/Event";
import {RegistrationEvent} from "../Models/RegistrationEvent";
import {Activity} from "../Models/Activity";
import {User} from "../Models/User";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private EventUrl: string = 'http://localhost:8082/Event-TrainingSession';

  constructor(private http: HttpClient) { }
  saveLocation(locationData: any): Observable<any> {
    // Replace '/api/location' with the actual endpoint where you send the location data
    return this.http.post('/api/location', locationData);
  }
  getUpcomingEvents(): Observable<Event[]> {
    const currentDate = new Date().toISOString();
    return this.http.get<Event[]>(`${this.EventUrl}/upcoming?currentDate=${currentDate}`);
  }




  findAllEvent(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.EventUrl}/events?page=${page}&size=${size}`);
  }
  hasRelatedActivities(eventId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.EventUrl}/${eventId}/hasRelatedActivities`);
  }
  findOneEvent(eventId: number): Observable<Event> {
    return this.http.get<Event>(`${this.EventUrl}/findOneEvent/${eventId}`);
  }

  updateEvent(eventId: number, event: Event): Observable<any> {
    return this.http.put(`${this.EventUrl}/events/${eventId}`, event);
  }
  getEventsWithRatings(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.EventUrl}/withRatings`);
  }

  addEvent(event: Event): Observable<Event> {
    console.log('Event to be added:', event);
    return this.http.post<Event>(`${this.EventUrl}/addEvent`, event);
  }


  deleteEvent(event_id: number): Observable<void> {
    return this.http.delete<void>(`${this.EventUrl}/deleteEvent/${event_id}`);
  }
  getRelatedUsers(eventId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.EventUrl}/getRelatedUsers/${eventId}`);
  }
  getRelatedRegistrations(eventId: number): Observable<RegistrationEvent[]> {
    return this.http.get<RegistrationEvent[]>(`${this.EventUrl}/getRelatedRegistrations/${eventId}`);
  }

  searchLocation(query: string, context: 'add' | 'update'): Observable<any> {
    // Adjust the URL to use the proxy route
    const url = `${this.EventUrl}/searchLocation?query=${encodeURIComponent(query)}`;
    return this.http.get<any[]>(url);
  }
  searchEvents(query: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.EventUrl}/search?query=${query}`);
  }
  getRelatedActivities(eventId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.EventUrl}/getRelatedActivities/${eventId}`);
  }
  likeEvent(eventId: number): Observable<any> {
    return this.http.post<any>(`${this.EventUrl}/${eventId}/like`, {});
  }

  dislikeEvent(eventId: number): Observable<any> {
    return this.http.post<any>(`${this.EventUrl}/${eventId}/dislike`, {});
  }
  updateEventAverageRating(eventId: number): Observable<any> {
    return this.http.put(`${this.EventUrl}/${eventId}/updateAverageRating`, {});
  }
}
