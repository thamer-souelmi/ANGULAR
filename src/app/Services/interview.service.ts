import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Interview } from '../Models/interview';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  urlIntrview: string = "http://localhost:8082/Interview";


  constructor(private myHttp: HttpClient) { }
  findAllInterviews(): Observable<Interview[]> {
    return this.myHttp.get<Interview[]>(this.urlIntrview + '/findAllInterviews');
  }
  addInterview(interview: Interview): Observable<Interview> {
    return this.myHttp.post<Interview>(this.urlIntrview + '/addInterview', interview);
  }
  getInterview(id: number): Observable<Interview> {
    return this.myHttp.get<Interview>(`${this.urlIntrview}/getInterview/${id}`);
  }

  updateInterview(id: Interview): Observable<void> {
    return this.myHttp.put<void>(`${this.urlIntrview}/updateInterview`, id);
  }
  deleteInterview(id: number): Observable<void> {
    return this.myHttp.delete<void>(`${this.urlIntrview}/deleteInterviewById/${id}`);
  }
  getSuccessRate(): Observable<Map<string, number>> {
    return this.myHttp.get<Map<string, number>>(`${this.urlIntrview}/success-rate`);
  }
}
