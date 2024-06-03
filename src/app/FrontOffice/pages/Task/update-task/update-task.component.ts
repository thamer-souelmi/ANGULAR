import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/Models/User';
import { Priority } from 'src/app/Models/priority';
import { Project } from 'src/app/Models/project';
import { Task } from 'src/app/Models/task';
import { TaskStatus } from 'src/app/Models/task-status';
import { ProjectService } from 'src/app/Services/project.service';
import { TaskService } from 'src/app/Services/task.service';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.css']
})
export class UpdateTaskComponent implements OnInit {
  projects: Project[] = [];
  employees: User[] = [];
  selectedProject!: Project;

  //priorityOptions: string[] = ['HIGH', 'MEDIUM', 'LOW'];
  //statuses: string[] = ['TODO', 'INPROGRESS', 'COMPLETED', 'CANCELED'];
  task: Task;
  priorityOptions: Priority[] = Object.values(Priority) as Priority[];
  statuses: TaskStatus[] = Object.values(TaskStatus) as TaskStatus[];
  constructor(
    private dialogRef: MatDialogRef<UpdateTaskComponent>,private toastr: ToastrService,private projectService:ProjectService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService
  ) {

    this.task = { ...data.task };
    this.task.projetT = this.selectedProject;


  }

  ngOnInit(): void {
    console.log("Initial task data:", this.task); // Vérifiez les données de la tâche initiale
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe(projects => {
      this.projects = projects;
      console.log("Loaded projects:", this.projects); // Vérifiez les projets chargés depuis le service
    });
  }

  onSubmit(): void {
    this.task.projetT = this.selectedProject;
    console.log("Submitting task:!!!!!!!!!!!!!!!!!!!!!!", this.task); // Vérifiez les données de la tâche soumise avant l'envoi au service
    const taskId = this.task.taskid;

    this.taskService.UpdateTask(taskId, this.task).subscribe(updatedTask => {
      console.log("Updated task response:", updatedTask); // Vérifiez la réponse du service après la mise à jour de la tâche
      this.toastr.success('Task successfully updated!', 'Success');
      this.dialogRef.close(updatedTask);
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }


  isValidStartDate(): boolean {
    const today = new Date();
    return new Date(this.task.startDateTask) >= today;
  }

  isValidEndDate(): boolean {
    return new Date(this.task.dueDateTask) > new Date(this.task.startDateTask);
  }
  isValidPositiveValue(value: number): boolean {
    return value > 0;
  }
}


