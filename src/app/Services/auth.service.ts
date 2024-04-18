import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {catchError, map} from "rxjs/operators";
//import {Token} from "./token";
import { StorageService } from './storage.service';

const AUTH_API = 'http://localhost:8082/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private storageService: StorageService) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        email,
        password,
      },
      httpOptions
    );
  }


  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', { }, httpOptions);
  }
    token: string = "";


    get(): any {
        return this.http.get("http://localhost:8082/api/auth/auth/url" );
    }

    getPrivate(url: string): any {
        return this.http.get("http://localhost:8082/api/auth" + url, {headers: new HttpHeaders({"Authorization": "Bearer " + this.token})});
    }

    getToken(code: string): Observable<{ token: string | null, user: any } | null> {
      return this.http.get<{ token: string | null, user: any }>("http://localhost:8082/api/auth/auth/callback?code=" + code, { observe: "response" })
        .pipe(
          map((response: HttpResponse<any>) => {
            if (response.status === 200 && response.body !== null) {
              const token = response.headers.get('Authorization'); // Assuming the token is sent in the Authorization header
              const user = response.body;
              console.log('Token:', token);
              console.log('User:', user);
              this.storageService.saveUser(user); // Save the user object to the storage service if needed
              return { token, user };
            } else {
              throw new Error('Invalid response status or empty body');
            }
          }),
          catchError((error) => {
            console.error('Error fetching token:', error);
            return of(null);
          })
        );
    }
    
  }
    

