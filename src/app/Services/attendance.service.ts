import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Attendance } from '../Models/Attendance';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private baseUrl = 'http://localhost:8082/attendance';
  private startTimeKey = 'attendanceStartTime';


  constructor(private http: HttpClient) { }

  getStartTime(): number | null {
    const startTime = localStorage.getItem(this.startTimeKey);
    return startTime ? parseInt(startTime, 10) : null;
  }

  setStartTime(startTime: number): void {
    localStorage.setItem(this.startTimeKey, startTime.toString());
  }

  clearStartTime(): void {
    localStorage.removeItem(this.startTimeKey);
  }

  getAllAttendances(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.baseUrl}/all`);
  }

  startAttendance(userId: number): Observable<number> { // Modifié pour retourner le type number
    return this.http.post<number>(`${this.baseUrl}/start?userId=${userId}`, null).pipe(
      tap(response => console.log('Start Attendance Response:', response))
    );
  }

  addAttendance(userId: number, attendance: Attendance): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.baseUrl}/add/${userId}`, attendance);
  }

  updateAttendance(attendanceId: number, attendance: Attendance): Observable<Attendance> {
    return this.http.put<Attendance>(`${this.baseUrl}/update/${attendanceId}`, attendance);
  }

  getAttendanceById(attendanceId: number): Observable<Attendance> {
    return this.http.get<Attendance>(`${this.baseUrl}/get/${attendanceId}`);
  }

  deleteAttendance(attendanceId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove/${attendanceId}`);
  }

  endAttendance(attendanceId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/end/${attendanceId}`, null);
  }
}
