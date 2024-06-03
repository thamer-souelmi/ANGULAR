import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  Router } from '@angular/router';
import { Project } from 'src/app/Models/project';

import { UpdateprojectComponent } from '../updateproject/updateproject.component';
import { Task } from 'src/app/Models/task';
import { TeamsmodalComponent } from 'src/app/BackOffice/Pages/Project/teamsmodal/teamsmodal.component';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit  {
  project: Project;


  constructor(private dialogRef: MatDialogRef<ProjectDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private router: Router) {
    this.project = data.project;
  }

  ngOnInit(): void {
    if (this.project && this.project.tasks) {
      console.log('Tasks for the project:', this.project.tasks);
      // Assurez-vous que chaque tâche a un employé associé
      this.project.tasks.forEach((task: Task) => {
        console.log('Employee for task', task.taskname + ':', task.employeeTask);
      });
    } else {
      console.log('No tasks found for the project.');
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
  openUpdateModal(): void {
    const dialogRef = this.dialog.open(UpdateprojectComponent, {
      width: '600px',
      data: { project: this.project }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  viewAssociatedTasks(): void {
    this.router.navigate(['/Project/task', this.project.projectId]);
  }
  uploadFiles(): void {
    this.router.navigate(['/Project/uploadfile']);
  }
  viewAssociatedInvoices(): void {
    this.router.navigate(['/Project/invoicefront', this.project.projectId]);
  }
  viewAssociatedContract(): void {
    this.router.navigate(['/Project/Contract', this.project.projectId]);
  }
  openteamModal(project: Project): void {
    const dialogRef = this.dialog.open(TeamsmodalComponent, {
      width: '400px',
      data: { project: project }  });

    dialogRef.afterClosed().subscribe(result => {
      // Traitez le résultat après la fermeture du modal si nécessaire
    });
  }
}
