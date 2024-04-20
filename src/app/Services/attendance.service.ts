import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendance } from '../Models/Attendance';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private baseUrl = 'http://localhost:8082/attendance'; // Update with your backend base URL

  constructor(private http: HttpClient) { }

  // Method to add attendance
  addAttendance(attendance: Attendance): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.baseUrl}/add`, attendance);
  }

  // Method to fetch attendance data
  getAttendance(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.baseUrl}/all`);
  }

  updateAttendance(attendance: Attendance): Observable<Attendance> {
    const url = `${this.baseUrl}/update/${attendance.attendenceId}`; // Assuming 'attendanceId' is the primary key
    return this.http.put<Attendance>(url, attendance);
  }
}
