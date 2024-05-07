import { Injectable } from '@angular/core';
import { Quote } from '../Models/quote';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {ProjectOffer} from "../Models/project-offer";

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  urlQuote: string = "http://localhost:8082/quote";

  constructor(private Http: HttpClient) { }

  addQuote(quote: Quote, projectOfferId: number): Observable<Quote> {
    // Include the projectOfferId in the URL as a path parameter
    return this.Http.post<Quote>(`${this.urlQuote}/addquote/${projectOfferId}`, quote);
 }
  getQuotes(): Observable<Quote[]>{
    return  this.Http.get<Quote[]>(this.urlQuote+ '/retrieve-quotes');
  }
  getQuotesNotNull(): Observable<Quote[]>{
    return  this.Http.get<Quote[]>(this.urlQuote+ '/retrieve-quotes-not-null');
  }

  deleteQuoteservice(quoteid: number): Observable<void> {
    return this.Http.delete<void>(`${this.urlQuote}/removequote/${quoteid}`);
  }

  getQuoteById(quoteid: number): Observable<Quote> {
    return this.Http.get<Quote>(`${this.urlQuote}/retrievequote/${quoteid}`);
  }

  updateQuote(quote: Quote, projectOfferId: number): Observable<void> {
    return this.Http.put<void>(`${this.urlQuote}/updatequote/${projectOfferId}`, quote);
  }
}
