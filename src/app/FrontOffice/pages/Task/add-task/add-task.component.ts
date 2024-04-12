import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Priority } from 'src/app/Models/priority';
import { Project } from 'src/app/Models/project';
import { Task } from 'src/app/Models/task';
import { TaskStatus } from 'src/app/Models/task-status';
import { ProjectService } from 'src/app/Services/project.service';
import { TaskService } from 'src/app/Services/task.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  projects: Project[] = []; 
  selectedProject!: Project; 

  newTask: Task = new Task(); 
  taskStatusOptions: string[] = ['TODO', 'INPROGRESS', 'COMPLETED', 'CANCELLED']; 
  selectedTaskStatus: TaskStatus = TaskStatus.TODO; 
  priorityOptions: string[] = ['HIGH', 'MEDIUM', 'LOW'];
  selectedPriority: Priority = Priority.MEDUIM; 
  statusOptions = Object.keys(TaskStatus).map(key => TaskStatus[key as keyof typeof TaskStatus]) ; 
  PpriorityOptions = Object.keys(Priority).map(key => Priority[key as keyof typeof Priority]) ; 


  constructor(private taskService: TaskService,private projectService: ProjectService, private dialogRef: MatDialogRef<AddTaskComponent>) { }

  ngOnInit(): void {
    this.loadProjects();
  }
  loadProjects(): void {
    
    this.projectService.getAllProjects().subscribe(projects => {
      this.projects = projects;
    });
  }
  onSubmit(): void {
    this.newTask.projetT = this.selectedProject;
    this.newTask.taskStatus = this.selectedTaskStatus;
    this.newTask.priority = this.selectedPriority;
    this.newTask.projetT = this.selectedProject;


    this.taskService.AddTask(this.newTask).subscribe(() => {
      this.dialogRef.close(true); 
    });
  }

  onClose(): void {
    this.dialogRef.close(); 
  }

  isValidStartDate(): boolean {
    const today = new Date();
    return new Date(this.newTask.startDateTask) >= today;
  }
  
  isValidDueDate(): boolean {
    return new Date(this.newTask.dueDateTask) > new Date(this.newTask.startDateTask);
  }
}



