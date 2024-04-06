import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Candidacy } from '../Models/candidacy';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidacyService {
  urlCandidacy: string = "http://localhost:8082/candidacy";

  findAllCandidacies(): Observable<Candidacy[]> {
    return this.myHttp.get<Candidacy[]>(this.urlCandidacy + '/findAllCandidacies');
  }

  addCandidate(candidate: {
    cv: string;
    candidateName: any;
    link: any;
    coverLetter: any;
    submissionDate: any;
    email: any;
    candidacystatus: any
  }): Observable<Candidacy> {
    return this.myHttp.post<Candidacy>(this.urlCandidacy + '/addCandidacy', candidate);
  }

  constructor(private myHttp:HttpClient) { }
  // getCandidaciesByJobOfferId(jobOfferId: number): Observable<Candidacy[]> {
  //   return this.myHttp.get<Candidacy[]>(`${this.urlCandidacy}/getCandidaciesByJobOfferId/${jobOfferId}`);
  // }
  // getCandidaciesByJobOfferId(jobOfferId: number): Observable<Candidacy[]> {
  //   return this.myHttp.get<Candidacy[]>(`${this.urlCandidacy}/getCandidaciesByJobOfferId/${jobOfferId}`);
  // }
  // getCandidaciesByJobOfferId(jobOfferId: number): Observable<Candidacy[]> {
  //   return this.myHttp.get<Candidacy[]>(`${this.urlCandidacy}/getCandidaciesByJobOfferId`, { params: { jobOfferId: jobOfferId.toString() } });
  // }
  getCandidaciesForJobOffer(jobOfferId: number): Observable<Candidacy[]> {
    return this.myHttp.get<Candidacy[]>(`${this.urlCandidacy}/${jobOfferId}/candidacies`);
  }
  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.urlCandidacy}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.myHttp.request(req);
  }

  getFiles(): Observable<any> {
    return this.myHttp.get(`${this.urlCandidacy}/files`);
  }
}
