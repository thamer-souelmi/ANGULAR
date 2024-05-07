import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Leaves } from '../Models/leaves';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeavesService {

  private baseUrl : string = 'http://localhost:8082/leaves';

  constructor(private http: HttpClient) { }
  findAllLeaves(): Observable<Leaves[]>{
    return this.http.get<Leaves[]>(this.baseUrl + '/retrieve-leaves');
  }
  addLeave(Leaves : Leaves, userId: number): Observable<Leaves>{
    return this.http.post<Leaves>(`${this.baseUrl}/add-leave/${userId}`,Leaves);
  }
  updateLeave(leave : Leaves): Observable<Leaves>{
    return this.http.put<Leaves>(this.baseUrl + '/update-leave',leave);
  }
  approuveLeave(leave : Leaves, userId: number): Observable<Leaves>{
    return this.http.put<Leaves>(`${this.baseUrl}/aprouve-leave/${userId}`,leave);
  }
  getLeaveById(leaveId: number): Observable<Leaves> {
    return this.http.get<Leaves>(`${this.baseUrl}/retrieve-leave/${leaveId}`);
  }

  deleteLeave(leaveId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-leave/${leaveId}`);
  }
}
