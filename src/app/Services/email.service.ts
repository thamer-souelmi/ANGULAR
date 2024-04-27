import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  constructor(private http: HttpClient) {}

  sendConfirmationEmail(userId: number, eventId: number): Observable<any> {
    const url = `/api/sendConfirmationEmail`;
    return this.http.post(url, { userId, eventId });
  }
}
