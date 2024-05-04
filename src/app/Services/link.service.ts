import { Injectable } from '@angular/core';
import { Link } from '../Models/link';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  urlTaskCrud:string="http://localhost:8082"
  constructor(private myHttp:HttpClient) { }


  getAllLinks():Observable<Link[]>{
    return this.myHttp.get<Link[]>(this.urlTaskCrud + '/Link/GetAllLinks'); 
  }

  AddLink(t:Link):Observable<Link>{
    return this.myHttp.post<Link>(this.urlTaskCrud +'/Link/AddLink' ,t);
  }


  UpdateLink(t:Link):Observable<Link>{
    return this.myHttp.put<Link>(`${this.urlTaskCrud}/Link/UpdateLink`,t);
  }


  deleteLink(id:number):Observable<void>{
    return this.myHttp.delete<void>(this.urlTaskCrud +'/Link/DeleteLinkbyid?id='+id);
  }




  get(): Promise<Link[]> {
    return Promise.resolve([
        { id: 1, source: 1, target: 2, type: '0' }
    ]);
}
}
