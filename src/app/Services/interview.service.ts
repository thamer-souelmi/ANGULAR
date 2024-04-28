import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Interview } from '../Models/interview';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  urlInterview: string = "http://localhost:8082/Interview";


  constructor(private myHttp: HttpClient) { }
  findAllInterviews(): Observable<Interview[]> {
    return this.myHttp.get<Interview[]>(this.urlInterview + '/findAllInterviews');
  }
  // addInterview(interview: Interview): Observable<Interview> {
  //   return this.myHttp.post<Interview>(this.urlInterview + '/addInterview', interview);
  // }
  addInterview(candidacyId: number, interview: Interview): Observable<Interview> {
    return this.myHttp.post<Interview>(`${this.urlInterview}/addInterview/${candidacyId}`, interview);
  }
  getInterview(id: number): Observable<Interview> {
    return this.myHttp.get<Interview>(`${this.urlInterview}/getInterview/${id}`);
  }

  updateInterview(id: Interview): Observable<void> {
    return this.myHttp.put<void>(`${this.urlInterview}/updateInterview`, id);
  }
  deleteInterview(id: number): Observable<void> {
    return this.myHttp.delete<void>(`${this.urlInterview}/deleteInterviewById/${id}`);
  }
  getSuccessRate(): Observable<Map<string, number>> {
    return this.myHttp.get<Map<string, number>>(`${this.urlInterview}/success-rate`);
  }
  findAllInterviewsWithCandidateNamesAndEmail(): Observable<Interview[]> {
    return this.myHttp.get<Interview[]>(`${this.urlInterview}/findAllInterviewsWithCandidateNamesAndEmail`);
  }
  findInterviewsByCandidacyId(candidacyId: number): Observable<Interview[]> {
    return this.myHttp.get<Interview[]>(`${this.urlInterview}/findInterviewsByCandidacyId/${candidacyId}`);
  }
}
