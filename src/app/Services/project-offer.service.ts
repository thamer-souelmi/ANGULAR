import { Injectable } from '@angular/core';
import { ProjectOffer } from '../Models/project-offer';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {Event} from "../Models/Event";
import {JobOffer} from "../Models/job-offer";

@Injectable({
  providedIn: 'root'
})
export class ProjectOfferService {
  urlProjectOffer: string = "http://localhost:8082/projectoffer";



    constructor(private Http: HttpClient) { }
    addProjectOffer(projectOffer: ProjectOffer): Observable<ProjectOffer> {
      return this.Http.post<ProjectOffer>(this.urlProjectOffer + '/addprojectoffer', projectOffer);
    }

  getProjectOffers(): Observable<ProjectOffer[]> {
    return this.Http.get<ProjectOffer[]>(this.urlProjectOffer + '/retrieve-projectoffers');
  }

  deleteProjectOfferservice(projectofferid: number): Observable<void> {
    return this.Http.delete<void>(`${this.urlProjectOffer}/removeprojectoffer/${projectofferid}`);
  }

  getProjectOfferById(projectofferid: number): Observable<ProjectOffer> {
    return this.Http.get<ProjectOffer>(`${this.urlProjectOffer}/retrieveprojectoffer/${projectofferid}`);
  }

  updateProjectOffer(projectOffer: ProjectOffer): Observable<void> {
    return this.Http.put<void>(`${this.urlProjectOffer}/updateprojectoffer`, projectOffer);
  }

}
