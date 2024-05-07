import { Injectable } from '@angular/core';
import {ContractEmployment} from "../Models/contract-employment";
import {catchError} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {JobOffer} from "../Models/job-offer";
import {Interview} from "../Models/interview";

@Injectable({
  providedIn: 'root'
})
export class ContractEmploymentService {
  urlContract: string = "http://localhost:8082/hr/contracts";


  constructor(private myHttp: HttpClient) { }
  getAllContractEmployments(): Observable<ContractEmployment[]> {
    return this.myHttp.get<ContractEmployment[]>(this.urlContract + '/all');
  }
  addContractByInterviewId(interviewId: number,contract: ContractEmployment): Observable<ContractEmployment> {
    return this.myHttp.post<ContractEmployment>(`${this.urlContract}/addContractByInterviewId/${interviewId}`, ContractEmployment);
  }


  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.urlContract}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.myHttp.request(req);
  }

  getFiles(): Observable<any> {
    return this.myHttp.get(`${this.urlContract}/files`);
  }
  startBatch(): Observable<any> {
    return this.myHttp.get<any>(this.urlContract + '/startBatch');
  }
}
