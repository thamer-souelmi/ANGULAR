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
  addInterview(candidacyId: number,userId :number, interview: Interview): Observable<Interview> {
    return this.myHttp.post<Interview>(`${this.urlInterview}/addInterview/${candidacyId}/${userId}`, interview);
  }

  updateInterview(interviewId: number, interviewDetails: Interview): Observable<Interview> {
    return this.myHttp.put<Interview>(`${this.urlInterview}/updateInterview/${interviewId}`, interviewDetails);
  }
  getInterviewById(interviewId: number): Observable<Interview> {
    return this.myHttp.get<Interview>(`${this.urlInterview}/${interviewId}`);
  }
  updateInterviewResult(interview_id: number, passed: boolean): Observable<Interview> {
    const body = { passed: passed };
    return this.myHttp.put<Interview>(`${this.urlInterview}/passed/${interview_id}`, body);
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
