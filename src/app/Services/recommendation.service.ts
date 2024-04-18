import { Injectable } from '@angular/core';
import {HttpClient , HttpHeaders} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  constructor(private http: HttpClient) { }

  sendRequirements(requirements: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<any>('http://127.0.0.1:5000/', requirements, { headers: headers });
  }
}
