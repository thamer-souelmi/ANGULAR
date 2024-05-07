import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest, HttpEvent, HttpHeaders} from '@angular/common/http';
import { Candidacy } from '../Models/candidacy';
import { Observable } from 'rxjs';
import {JobOffer} from "../Models/job-offer";

@Injectable({
  providedIn: 'root'
})
export class CandidacyService {
  urlCandidacy: string = "http://localhost:8082/candidacy";
// urlRecommender:string="http://127.0.0.1:5000/";
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
  }, id: number): Observable<Candidacy> {
    return this.http.post<Candidacy>(`${this.urlCandidacy}/addCandidacy?id=${id}`, candidate);
  }
  getCandidacyById(id: number): Observable<Candidacy> {
    return this.myHttp.get<Candidacy>(`${this.urlCandidacy}/${id}`);
  }
  getCandidateName(candidacyId: number): Observable<string> {
    return this.http.get<string>(`${this.urlCandidacy}/candidateName/${candidacyId}`);
  }
  constructor(private myHttp:HttpClient,private http:HttpClient) { }

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
  updateCandidacyStatus(candidacy: Candidacy,userId: number): Observable<Candidacy> {
    const updateUrl = `${this.urlCandidacy}/updateCandidacyStatus/${userId}`;
    return this.myHttp.put<Candidacy>(updateUrl, candidacy);
  }
  // verifyEmail(email: string): Observable<any> {
  //   const apiUrl = `https://api.proofy.io/verifyaddr?aid=60118&key=TgMZZ2TTg7G1tDjsSpWPnJUg&email=${email}`;
  //   return this.myHttp.get(apiUrl);
  // }
  getCandidateStatisticsByCountry(): Observable<any[]> {
    const url = `${this.urlCandidacy}/candidateStatisticsByCountry`;
    return this.myHttp.get<any[]>(url);
  }
  getMostQualifiedCandidatesStatistics(): Observable<any[]> {
    const url = `${this.urlCandidacy}/mostQualifiedCandidatesStatistics`;
    return this.myHttp.get<any[]>(url);
  }
  // sendRequirements(requirements: any) {
  //   const url = `${this.urlRecommender}`; // Update the URL to point to your Flask server
  //   return this.http.post<any>(url, requirements); // Pass requirements as the second argument
  // }
  sendRequirements(requirements: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<any>('http://127.0.0.1:5000', requirements, { headers: headers, withCredentials: true });
  }


}
