import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Project } from '../Models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  urlProjectCrud:string="http://localhost:8082"

  constructor(private myHttp:HttpClient) { }

  getAllProjects():Observable<Project[]>{
    return this.myHttp.get<Project[]>(this.urlProjectCrud + '/Project/GetAllProjects'); 
  }
  

  getProjectById(id:number):Observable<Project>{
    return this.myHttp.get<Project>(this.urlProjectCrud +"/Project/GetProjectbyid?id="+id);
  }

  AddProject(p:Project, id:number):Observable<Project>{
    return this.myHttp.post<Project>(`${this.urlProjectCrud}/Project/AddProject/${id}` ,p);
  }

  UpdateProject(p:Project):Observable<Project>{
    return this.myHttp.put<Project>(this.urlProjectCrud +'/Project/UpdateProject' ,p);
  }

  deleteProject(id:number):Observable<void>{
    return this.myHttp.delete<void>(this.urlProjectCrud +'/Project/DeleteProjectbyid?projectid='+id);
  }

  searchProjects(keyword: string): Observable<Project[]> {
    return this.myHttp.get<Project[]>(`${this.urlProjectCrud }/Project/searchProject?keyword=${keyword}`);
  }






}