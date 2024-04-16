import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  constructor(private http: HttpClient) { }

  sendRequirements(requirements: any) {
    return this.http.post<any>('http://127.0.0.1:5000/', requirements);
  }
}
