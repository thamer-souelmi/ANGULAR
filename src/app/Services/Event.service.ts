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
      console.log('Sending event:', JSON.stringify(event));  // This will show you exactly what is being sent
      return this.http.post<Event>(`${this.EventUrl}/addEvent`, event);
    }



    deleteEvent(event_id: number): Observable<void> {
      return this.http.delete<void>(`${this.EventUrl}/deleteEvent/${event_id}`);
    }
    searchLocation(query: string): Observable<any> {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
      return this.http.get<any[]>(url);
    }
    getRelatedUsers(eventId: number): Observable<User[]> {
      return this.http.get<User[]>(`${this.EventUrl}/getRelatedUsers/${eventId}`);
    }
    getRelatedRegistrations(eventId: number): Observable<RegistrationEvent[]> {
      return this.http.get<RegistrationEvent[]>(`${this.EventUrl}/getRelatedRegistrations/${eventId}`);
    }
    getAddress(lat: number, lon: number) {
      // Using the proxy endpoint
      const url = `/api/reverse?format=json&lat=${lat}&lon=${lon}`;
      return this.http.get(url);
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
    getReverseGeocode1(lat: number, lon: number): Observable<any> {
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const targetUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
      return this.http.get(`${proxyUrl}${targetUrl}`);
    }
    getReverseGeocode(lat: number, lon: number): Observable<any> {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
      return this.http.get(url);
    }
  }
