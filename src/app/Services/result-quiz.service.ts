import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ContractEmployment} from "../Models/contract-employment";
import {Observable} from "rxjs";
import {ResultQuiz} from "../Models/result-quiz";

@Injectable({
  providedIn: 'root'
})
export class ResultQuizService {
  url: string = "http://localhost:8082/resultQuiz";

  constructor(private myHttp: HttpClient) { }
  addResult(result: ResultQuiz): Observable<ResultQuiz> {
    return this.myHttp.post<ResultQuiz>(`${this.url}/add`, result);
  }
}
