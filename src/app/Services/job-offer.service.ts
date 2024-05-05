import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JobOffer } from '../Models/job-offer';
import { Candidacy } from '../Models/candidacy';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class JobOfferService {
  urlJobOffer: string = "http://localhost:8082/JobOffer";
  private wishlistKey = 'wishlist'; // Define wishlistKey as a class property


  constructor(private myHttp: HttpClient) { }
  findAllJobOffers(): Observable<JobOffer[]> {
    return this.myHttp.get<JobOffer[]>(this.urlJobOffer + '/findAllJobOffers');
  }
  addJobOffer(jobOffer: JobOffer,userId: number): Observable<JobOffer> {
    return this.myHttp.post<JobOffer>(`${this.urlJobOffer}/addJobOffer/${userId}`, jobOffer);
  }
  getJobOfferById(jobOfferId: number): Observable<JobOffer> {
    return this.myHttp.get<JobOffer>(`${this.urlJobOffer}/${jobOfferId}`);
  }

  updateJobOffer(jobOfferId: number, jobOfferDetails: JobOffer): Observable<JobOffer> {
    return this.myHttp.put<JobOffer>(`${this.urlJobOffer}/updateJobOffer/${jobOfferId}`, jobOfferDetails);
  }


  deleteJobOffer(jobId: number): Observable<void> {
    return this.myHttp.delete<void>(`${this.urlJobOffer}/deleteJobOfferById/${jobId}`);
  }
  addToWishlist(jobOffer: JobOffer): Observable<any> {
    let wishlist: JobOffer[] = JSON.parse(localStorage.getItem(this.wishlistKey) || '[]'); // Ensure localStorage.getItem() returns a string or an empty array
    if (!wishlist.some(item => item.jobOffer_id === jobOffer.jobOffer_id)) {
      wishlist.push(jobOffer);
      localStorage.setItem(this.wishlistKey, JSON.stringify(wishlist));
    }
    return new Observable(observer => {
      observer.next(null); // Emit a null value
      observer.complete(); // Complete the observable
    });
  }

  getCandidaciesByJobOfferId(jobOfferId: number): Observable<Candidacy[]> {
    return this.myHttp.get<Candidacy[]>(`${this.urlJobOffer}/${jobOfferId}/candidacies`);
  }
  getJobOfferStatistics(): Observable<any[]> {
    return this.myHttp.get<any[]>(`${this.urlJobOffer}/getJobOfferStatistics`);
  }


}
