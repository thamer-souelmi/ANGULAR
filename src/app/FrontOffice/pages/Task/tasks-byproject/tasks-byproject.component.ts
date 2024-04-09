import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/Models/task';
import { TaskService } from 'src/app/Services/task.service';
import { AddTaskComponent } from '../add-task/add-task.component';
import { MatDialog } from '@angular/material/dialog';
import { Priority } from 'src/app/Models/priority';
import { UpdateTaskComponent } from '../update-task/update-task.component';

@Component({
  selector: 'app-tasks-byproject',
  templateUrl: './tasks-byproject.component.html',
  styleUrls: ['./tasks-byproject.component.css']
})
export class TasksByprojectComponent {
  constructor(private ts:TaskService,private router: Router,private route: ActivatedRoute,private dialog: MatDialog){
    
  }
  priorities = ['HIGH', 'MEDUIM', 'LOW'];
  
  Priority = Priority;
  tasks: Task[] = [];
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params !== null) {
        const projectIdParam = params.get('projectId');
        if (projectIdParam !== null) {
          const projectId = parseInt(projectIdParam, 10); 
          if (!isNaN(projectId)) {
            this.getTasksByProjectId(projectId);
          }
        }
      }
    });
  }
  

  getTasksByProjectId(projectId: number): void {
    this.ts.getTasksByProjectId(projectId).subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  deleteTask(taskId: number) {
    if (confirm('Are you sure you want to delete this project?')) {
    this.ts.deleteTask(taskId).subscribe(() => {
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
      case 'MEDUIM':
        return 'medium-priority';
      case 'LOW':
        return 'low-priority';
      default:
        return '';
    }
}
createNewTask(): void {
  const dialogRef = this.dialog.open(AddTaskComponent, {
    width: '500px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
    }
  });
}
  
  }



