import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { Room } from 'src/app/Models/Room';
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:8082/TrainingSession-Room';

  constructor(private http: HttpClient) {}
  getAllRooms(page: number, size: number, searchTerm?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());



    return this.http.get(`${this.apiUrl}/getAll`, { params: params });
  }
  getUnavailableDates(roomId: number): Observable<Date[]> {
    const url = `${this.apiUrl}/${roomId}/unavailable-dates`;
    return this.http.get<Date[]>(url);
  }
  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`);
  }

  createRoom(roomData: Room): Observable<Room> {
    const postData = {
      nameRoom: roomData.nameRoom, // Adjust the key to match backend expectation
      capacityRoom: roomData.capacityRoom, // Changed from 'capacity' to 'capacityRoom'
      available: roomData.available,
      equipmentR: roomData.equipmentR
    };

    console.log('Posting data to server:', postData);
    console.log('Form data being submitted:', roomData);

    return this.http.post<Room>(`${this.apiUrl}/add`, postData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error from server:', error.message);
        console.error('Detailed error:', error.error);
        return throwError(() => new Error(`Error creating room: ${error.status} ${error.statusText}`));
      })
    );
  }

  updateRoom(id: number, room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/${id}`, room);
  }

  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkRoomAvailability(roomId: number, startDate: Date, endDate: Date): Observable<boolean> {
    const start = startDate.toISOString();
    const end = endDate.toISOString();
    return this.http.get<boolean>(`${this.apiUrl}/${roomId}/availability`, {
      params: { start, end }
    });
  }

}
