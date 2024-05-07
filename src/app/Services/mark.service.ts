import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Mark} from "../Models/mark";

@Injectable({
  providedIn: 'root'
})
export class MarkService {
  url: string = "http://localhost:8082/Mark";

  constructor(private http: HttpClient) {}

    addMark(mark: Mark, candidacyId: number): Observable<Mark>{
      return this.http.post<Mark>(`${this.url}/addMark/${candidacyId}`, mark);
    }
  getCandidateNameById(candidacyId: number): Observable<any> { // Changed from Observable<string> to Observable<any>
    return this.http.get<any>(`${this.url}/getCandidateName/${candidacyId}`);
  }
}
