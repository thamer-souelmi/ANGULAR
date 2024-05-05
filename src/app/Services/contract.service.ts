import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contract } from '../Models/contract';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  urlContractCrud:string="http://localhost:8082"

  constructor(private myHttp:HttpClient) { }
  getAllcontracts():Observable<Contract[]>{
    return this.myHttp.get<Contract[]>(this.urlContractCrud + '/Contract/getAllContracts'); 
  }


  deletecontract(id:number):Observable<void>{
    return this.myHttp.delete<void>(this.urlContractCrud +'/Contract/DeleteContractByid?id='+id);
  }

  UpdateInvoice(t:Contract):Observable<Contract>{
    return this.myHttp.put<Contract>(`${this.urlContractCrud}/Contract/UpdateContract`,t);
  }

  AddInvoice(t:Contract):Observable<Contract>{
    return this.myHttp.post<Contract>(this.urlContractCrud +'/Contract/AddContract' ,t);
  }
  getInvoiceParProject( projectId:number):Observable<Contract>{
    return this.myHttp.get<Contract>(this.urlContractCrud + '/Contract/getContractById?id='+projectId); 
  }

}
