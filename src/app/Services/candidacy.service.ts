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
  getAllCandidaciesByJobOfferId(jobOfferId: number): Observable<Candidacy[]> {
    const url = `${this.urlCandidacy}/getAlCandidaciesByJobOfferId/${jobOfferId}`;
    return this.myHttp.get<Candidacy[]>(url);
  }
  countCandidaciesByJobOfferId(jobOfferId: number): Observable<number> {
    return this.myHttp.get<number>(`${this.urlCandidacy}/countByJobOfferId/${jobOfferId}`);
  }
  updateCandidacyStatus(candidacy: Candidacy): Observable<Candidacy> {
    const updateUrl = `${this.urlCandidacy}/updateCandidacyStatus`;
    return this.myHttp.put<Candidacy>(updateUrl, candidacy);
  }
  verifyEmail(email: string): Observable<any> {
    const apiUrl = `https://api.proofy.io/verifyaddr?aid=60118&key=TgMZZ2TTg7G1tDjsSpWPnJUg&email=${email}`;
    return this.myHttp.get(apiUrl);
  }
  getCandidateStatisticsByCountry(): Observable<any[]> {
    const url = `${this.urlCandidacy}/candidateStatisticsByCountry`;
    return this.myHttp.get<any[]>(url);
  }
}
