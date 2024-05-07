import { Injectable } from '@angular/core';
import { ActionLog } from '../Models/ActionLogs';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ActionLogService {
  urlLogs: string = "http://localhost:8082/actionlogs";

  constructor(private Http: HttpClient) { }

  getActionLogs(): Observable<ActionLog[]>{
    return  this.Http.get<ActionLog[]>(this.urlLogs+ '/all');
  }
  getActionLogsForEntity(entityId: number): Observable<ActionLog[]> {
    // Construct the URL with the entityId as a path variable
    const url = `${this.urlLogs}/one/${entityId}`;
    return this.Http.get<ActionLog[]>(url);
 }
 // In your ActionLogService

getEntityIds(): Observable<number[]> {
    return this.Http.get<number[]>(this.urlLogs+ '/entityIds');
   }


   getInactiveEntityIds(): Observable<number[]> {
    const url = `${this.urlLogs}/check-inactivity-minute`; // Assuming this endpoint checks for inactivity
    return this.Http.get<number[]>(url);
  }
   

}