import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrencyConversionService {

  private apiUrl = 'http://apilayer.net/api/live';
  private accessKey = '62cd0b67e64af4cd8c54f819bcdef722';

  constructor() { }

  convertToCurrency(amount: number, currency: string): Observable<number> {
    const url = `${this.apiUrl}?access_key=${this.accessKey}&currencies=${currency}&source=EUR&format=1`;

    return new Observable<number>((observer) => {
      axios.get(url)
        .then(response => {
          console.log('Response from API:', response); 
          const rate = response.data.quotes[`EUR${currency}`];
          observer.next(amount * rate);
          observer.complete();
        })
        .catch(error => {
          console.error('Error fetching exchange rates:', error);
          observer.error(error);
        });
    });
  }
}
