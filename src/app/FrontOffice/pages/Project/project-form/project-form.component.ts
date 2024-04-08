import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/Models/project';
import { ProjectService } from 'src/app/Services/project.service';
import { MatDialogRef } from '@angular/material/dialog';
import { StatusProject } from 'src/app/Models/status-project';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {

  newProject: Project = {} as Project; 
  Pstatus :string[] =[ 'planned', 'in_progress','completed', 'on_Hold', 'canceled']
  selectedProjectStatus: StatusProject = StatusProject.planned; 
  statusOptions = Object.keys(StatusProject).map(key => StatusProject[key as keyof typeof StatusProject]) ; 
  constructor(private projectService: ProjectService, private dialogRef: MatDialogRef<ProjectFormComponent>) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.newProject.projectStatus = this.selectedProjectStatus;

    this.projectService.AddProject(this.newProject).subscribe(project => {
      this.dialogRef.close(true);
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
  isValidStartDate(): boolean {
    const today = new Date();
    return new Date(this.newProject.startdateProject) >= today;
  }
  
  isValidEndDate(): boolean {
    return new Date(this.newProject.enddateProject) > new Date(this.newProject.startdateProject);
  }
}