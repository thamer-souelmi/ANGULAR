import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  Router } from '@angular/router';
import { Project } from 'src/app/Models/project';

import { UpdateprojectComponent } from '../updateproject/updateproject.component';

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
}