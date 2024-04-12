import {HttpClient, HttpEvent, HttpRequest, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../Models/User';
const API_URL = 'http://localhost:8082/api/test/';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl : string = 'http://localhost:8082/user';

  constructor(private http: HttpClient) { }
  findAllUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.baseUrl + '/retrieveAllUser');
  }

  addUser(user : User): Observable<User>{
    return this.http.post<User>(this.baseUrl + '/addUser',user);
  }
  updateUser(user : User): Observable<User>{
    return this.http.put<User>(this.baseUrl + '/updateUser',user);
  }
  saveUsers(users: any[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/save`, users);
  }
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/retrieveOneUser/${userId}`);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/removeUser/${userId}`);
  }
  private baseUrlf = 'http://localhost:8082';

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrlf}/files/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrlf}/files`);
  }
  getFile(filename: string): Observable<HttpResponse<Blob>> {
    const url = `${this.baseUrlf}/files/${filename}`;
    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response' // To access full response including headers
    });
  }

}
