import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/Models/User';
import { Priority } from 'src/app/Models/priority';
import { Project } from 'src/app/Models/project';
import { Task } from 'src/app/Models/task';
import { TaskStatus } from 'src/app/Models/task-status';
import { ProjectService } from 'src/app/Services/project.service';
import { TaskService } from 'src/app/Services/task.service';
import { UserService } from 'src/app/Services/user.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  
  projects: Project[] = []; 
  selectedProject!: Project; 

  employeeTask:User[]=[];
  selectedEmployee!: User; 


  taskStatusOptions: string[] = ['TODO', 'INPROGRESS', 'COMPLETED', 'CANCELLED']; 
  selectedTaskStatus: TaskStatus = TaskStatus.TODO; 
  priorityOptions: string[] = ['HIGH', 'MEDIUM', 'LOW'];
  selectedPriority: Priority = Priority.MEDUIM; 
  statusOptions = Object.keys(TaskStatus).map(key => TaskStatus[key as keyof typeof TaskStatus]) ; 
  PpriorityOptions = Object.keys(Priority).map(key => Priority[key as keyof typeof Priority]) ; 

    statuses: string[] = ['TODO', 'INPROGRESS', 'COMPLETED', 'CANCELED'];

  constructor(private taskService: TaskService,private projectService: ProjectService, private dialogRef: MatDialogRef<AddTaskComponent>,private userService: UserService,private toastr: ToastrService) { }
  @ViewChild('taskForm') taskForm!: NgForm;   
  newTask: Task  = {} as Task;

  ngOnInit(): void {
    this.loadProjects();
    this.loadEmployees();
    
  }
  loadEmployees(): void {
    this.userService.getEmployeesForTASKS().subscribe(employees =>{
      this.employeeTask=employees;
    });


  }
  loadProjects(): void {
    
    this.projectService.getAllProjects().subscribe(projects => {
      this.projects = projects;
    });
  }
  onSubmit(): void {
    if (!this.selectedProject || !this.selectedEmployee) {
      console.error('Project or Employee not selected');
      return;
    }

    const projectId = this.selectedProject.projectId;
    const userId = this.selectedEmployee.userId;

    this.newTask.projetT = this.selectedProject;
    this.newTask.employeeTask = this.selectedEmployee;
    console.log("*******************************",this.newTask);
    console.log("***************user****************",userId);
    console.log("**************project*****************",projectId);



    this.taskService.AddTask(projectId, userId, this.newTask).subscribe(() => {
      console.log("*******************************",this.newTask);
      console.log("***************user****************",userId);
      console.log("**************project*****************",projectId);
      console.log(userId,"***",projectId,"")
      this.toastr.success('Task successfully Added!', 'Success');
      this.dialogRef.close(true);
    }, error => {
      console.error('Error adding task:', error);
    });
  }
  onClose(): void {
    this.dialogRef.close(); 
  }

  isValidStartDate(): boolean {
    const today = new Date();
    return new Date(this.newTask.startDateTask) >= today;
  }

  isValidEndDate(): boolean {
    return new Date(this.newTask.dueDateTask) > new Date(this.newTask.startDateTask);
  }
}



