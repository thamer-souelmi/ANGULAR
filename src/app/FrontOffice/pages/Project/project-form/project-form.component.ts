import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/Models/project';
import { ProjectService } from 'src/app/Services/project.service';
import { MatDialogRef } from '@angular/material/dialog';
import { StatusProject } from 'src/app/Models/status-project';
import { User } from 'src/app/Models/User';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {

  newProject: Project = {} as Project; 
  projectManagers: User[] = [];
  selectedmanager!: User; 

  Pstatus :string[] =[ 'planned', 'in_progress','completed', 'on_Hold', 'canceled']
  selectedProjectStatus: StatusProject = StatusProject.planned; 
  statusOptions = Object.keys(StatusProject).map(key => StatusProject[key as keyof typeof StatusProject]) ; 
  constructor(private projectService: ProjectService, private dialogRef: MatDialogRef<ProjectFormComponent>,private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getProjectManagers().subscribe(
      managers => {
        this.projectManagers = managers;
        console.log('Project Managers:', this.projectManagers); // Check if data is correctly fetched
      },
      error => {
        console.error('Error fetching project managers:', error); // Log any errors
      }
    );
  }

  onSubmit(): void {
    this.newProject.projectStatus = this.selectedProjectStatus;
    this.newProject.projectManager=this.selectedmanager;
    console.log('Selected Project Manager:', this.selectedmanager);
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