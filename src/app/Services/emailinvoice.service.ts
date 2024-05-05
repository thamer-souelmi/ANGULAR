import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailinvoiceService {
  urlInvoiceCrud:string="http://localhost:8082";
  constructor(private http: HttpClient) { }

  sendEmailWithAttachment(attachmentData: Uint8Array, recipientEmail: string): Observable<any> {
    const formData = new FormData();
    formData.append('attachmentData', new Blob([attachmentData], { type: 'application/pdf' }), 'invoice.pdf');
    formData.append('recipientEmail', recipientEmail);
    return this.http.post<any>(`${this.urlInvoiceCrud}/mail/sendEmailWithAttachment`, formData);
  }
}
