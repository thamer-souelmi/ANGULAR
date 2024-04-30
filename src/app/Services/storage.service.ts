import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import { Observable } from 'rxjs';
import { User } from '../Models/User';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private cookieService: CookieService,private http: HttpClient) {}

  clean(): void {
    window.sessionStorage.clear();
    this.cookieService.delete(USER_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.cookieService.delete(USER_KEY);
    this.cookieService.set(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = this.cookieService.get(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  private baseUrl : string = 'http://localhost:8082/user';
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/retrieveOneUser/${userId}`);
  }
  public getUserS(): any {
    const userString = localStorage.getItem(USER_KEY);
    return userString ? JSON.parse(userString) : null;
  }

  public isLoggedIn(): boolean {
    return this.cookieService.check(USER_KEY);

  }
  public saveGoogleUser(token: string): void {
    this.http.get<UserProfile>('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe((userProfile: UserProfile) => {
      this.saveUser(userProfile);
    });
  }
}
interface UserProfile {
  id: string;
  email: string;
  // Add any other properties you expect to receive from the Google OAuth userinfo endpoint
}