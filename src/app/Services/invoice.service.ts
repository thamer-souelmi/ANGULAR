import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice } from '../Models/invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  urlInvoiceCrud:string="http://localhost:8082"

  constructor(private myHttp:HttpClient) { }

  getAllInvoices():Observable<Invoice[]>{
    return this.myHttp.get<Invoice[]>(this.urlInvoiceCrud + '/Invoice/GetAllInvoice'); 
  }

  getInvoiceParProject( projectId:number):Observable<Invoice[]>{
    return this.myHttp.get<Invoice[]>(this.urlInvoiceCrud + '/Invoice/GetInvoicebyPROJECT?projectId='+projectId); 
  }

  deleteInvoice(id:number):Observable<void>{
    return this.myHttp.delete<void>(this.urlInvoiceCrud +'/Invoice/DeleteByid?invoiceid='+id);
  }

  UpdateInvoice(t:Invoice):Observable<Invoice>{
    return this.myHttp.put<Invoice>(`${this.urlInvoiceCrud}/Invoice/UpdateInvoice`,t);
  }

  AddInvoice(t:Invoice):Observable<Invoice>{
    return this.myHttp.post<Invoice>(this.urlInvoiceCrud +'/Invoice/AddInvoice' ,t);
  }
}
