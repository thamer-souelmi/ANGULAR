import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UpdateTaskComponent } from 'src/app/FrontOffice/pages/Task/update-task/update-task.component';
import { Priority } from 'src/app/Models/priority';
import { Project } from 'src/app/Models/project';
import { Task } from 'src/app/Models/task';
import { ProjectService } from 'src/app/Services/project.service';
import { TaskService } from 'src/app/Services/task.service';
import {Sort} from '@angular/material/sort';

@Component({
  selector: 'app-taskback',
  templateUrl: './taskback.component.html',
  styleUrls: ['./taskback.component.css']
})
export class TaskbackComponent implements OnInit {
  sortedData: Project[] = [];
  selectedProject: Project | null = null;
  selectedProjectTasks: Task[] | null = null;
  //sort
  
  projects!: Project[];

  constructor(private ts: TaskService,private tp:ProjectService, private router: Router, private dialog: MatDialog) {

  }

  ngOnInit() {
    this.loadProjects();
  }
  

  loadProjects() {
    this.tp.getAllProjects().subscribe(projects => {
      this.sortedData = projects;
      //sort
      this.projects = projects; // Assignez les projets récupérés à this.projects
      this.sortedData = this.projects.slice(); // Initialisez sortedData ici
    });
  }

  toggleTasks(project: Project) {
    if (this.selectedProject === project) {
      this.selectedProject = null;
      this.selectedProjectTasks = null;
    } else {
      this.selectedProject = project;
      this.loadTasksForProject(project);
    }
  }

  loadTasksForProject(project: Project) {
    this.ts.getTasksByProjectId(project.projectId).subscribe(tasks => {
      this.selectedProjectTasks = tasks.length > 0 ? tasks : null;
    });
  }

  

  deleteTask(taskId: number) {
    if (confirm('Are you sure you want to delete this Task?')) {
      this.ts.deleteTask(taskId).subscribe(() => {
        this.loadProjects();
      });
    }
  }

  updateTask(task: Task): void  {
    const dialogRef = this.dialog.open(UpdateTaskComponent, {
      width: '400px',
      data: { task: task }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'HIGH':
        return 'high-priority';
      case 'MEDIUM':
        return 'medium-priority';
      case 'LOW':
        return 'low-priority';
      default:
        return '';
    }
  }
  //sort
  sortData(sort: Sort) {
    const data = this.projects.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'startdateProject':
          return this.compare(new Date(a.startdateProject), new Date(b.startdateProject), isAsc);
        case 'enddateProject':
          return this.compare(new Date(a.enddateProject), new Date(b.enddateProject), isAsc);
        case 'projectManager':
          return this.comparestring((a.projectManager.firstname), (b.projectManager.firstname), isAsc);
        default:
          return 0;
      }
    });
  }
  
  compare(a: Date, b: Date, isAsc: boolean): number {
    if (a < b) {
      return isAsc ? -1 : 1;
    } else if (a > b) {
      return isAsc ? 1 : -1;
    } else {
      return 0;
    }
  }
  comparestring(a: String, b: String, isAsc: boolean): number {
    if (a < b) {
      return isAsc ? -1 : 1;
    } else if (a > b) {
      return isAsc ? 1 : -1;
    } else {
      return 0;
    }
  }
  navigateToStatistics() {
    this.router.navigate(['Projectback/emplyeestat']);
  }
}



