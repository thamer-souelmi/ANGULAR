import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../Models/task';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  urlTaskCrud: string = "http://localhost:8082"

  constructor(private myHttp: HttpClient) { }
  getAllTasks(): Observable<Task[]> {
    return this.myHttp.get<Task[]>(this.urlTaskCrud + '/Task/GetAllTasks');
  }

  getPaginatedTasks(page: number = 0, pageSize: number = 10): Observable<Task[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.myHttp.get<Task[]>(`${this.urlTaskCrud}/tasksbythree`, { params });
  }

  getTaskById(id: number): Observable<Task> {
    return this.myHttp.get<Task>(this.urlTaskCrud + "/Task/GetTaskbyid?Taskid=" + id);
  }

  AddTask(projectId: number, userId: number, task: Task): Observable<Task> {
    console.log("*******************************", task);
    console.log("***************user****************", userId);
    console.log("**************project*****************", projectId);
    return this.myHttp.post<Task>(`${this.urlTaskCrud}/Task/AddTask/${projectId}/${userId}`, task);
  }


  UpdateTask(taskId: number, task: Task): Observable<Task> {
    return this.myHttp.put<Task>(`${this.urlTaskCrud}/Task/UpdateTask/${taskId}`, task);
  }


  deleteTask(id: number): Observable<void> {
    return this.myHttp.delete<void>(this.urlTaskCrud + '/Task/DeleteTaskbyid?Taskid=' + id);
  }

  getTasksByProjectId(projectId: number): Observable<Task[]> {
    return this.myHttp.get<Task[]>(this.urlTaskCrud + "/Task/getTasksbyproject?projectId=" + projectId);
  }

  addTaskWithProject(task: Task, projectName: string): Observable<void> {
    return this.myHttp.put<void>(`${this.urlTaskCrud}/Task/affecterTaskaunprojet?taskname=`, { task, projectName });
  }


  getAllProjectNames(): Observable<string[]> {
    return this.myHttp.get<string[]>(this.urlTaskCrud + '/Task/getprojectNames');
  }
  getTasksByStatus(status: string): Observable<Task[]> {
    return this.myHttp.get<Task[]>(`${this.urlTaskCrud}/Task/tasks?status=${status}`);
  }

  getCountByEmployeeTask(userId: number): Observable<number> {
    return this.myHttp.get<number>(`${this.urlTaskCrud}/Task/countByEmployeeTask?userId=${userId}`);
  }

  checkAvailableTasks(userId: number): Observable<boolean> {
    return this.myHttp.get<boolean>(`${this.urlTaskCrud}/Task/available?userId=${userId}`);
  }

  searchTasks(keyword: string): Observable<Task[]> {
    return this.myHttp.get<Task[]>(`${this.urlTaskCrud}/Task/searchTasks?keyword=${keyword}`);
  }
}
