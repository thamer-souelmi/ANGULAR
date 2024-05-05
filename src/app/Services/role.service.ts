import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';
import {Role} from "../Models/role";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private baseUrl : string = 'http://localhost:8082/role';

  constructor(private http: HttpClient) { }
  findAllRoles(): Observable<Role[]>{
    return this.http.get<Role[]>(this.baseUrl + '/retrieveAllRoles');
  }
  addRole(role : Role): Observable<Role>{
    return this.http.post<Role>(this.baseUrl + '/addRole',role);
  }
  updateRole(role : Role): Observable<Role>{
    return this.http.put<Role>(this.baseUrl + '/updateRole',role);
  }
  getRoleById(roleId: number): Observable<Role> {
    return this.http.get<Role>(`${this.baseUrl}/retrieveOneRole/${roleId}`);
  }

  deleteRole(roleId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/removeRole/${roleId}`);
  }
}

