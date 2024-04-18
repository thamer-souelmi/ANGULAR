import { HttpClient } from '@angular/common/http';
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
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/retrieveOneUser/${userId}`);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/removeUser/${userId}`);
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/email/${email}`);
  }
}
