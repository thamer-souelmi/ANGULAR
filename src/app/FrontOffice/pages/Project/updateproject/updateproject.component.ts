import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from 'src/app/Models/project';
import { StatusProject } from 'src/app/Models/status-project';
import { ProjectService } from 'src/app/Services/project.service';



@Component({
  selector: 'app-updateproject',
  templateUrl: './updateproject.component.html',
  styleUrls: ['./updateproject.component.css']
})
export class UpdateprojectComponent implements OnInit{
  Pstatus: string[] = ['planned', 'in_progress', 'completed', 'on_Hold', 'canceled'];
  selectedProjectStatus: StatusProject = StatusProject.planned; 
    statusOptions = Object.keys(StatusProject).map(key => StatusProject[key as keyof typeof StatusProject]) ; 
  project: Project;
  projectStatuses: string[];
  projectStatus!: StatusProject;  
  constructor(
    private dialogRef: MatDialogRef<UpdateprojectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectService
  ) {
    this.project = { ...data.project }; 
    this.projectStatuses = this.getEnumValues(StatusProject);
    console.log(this.projectStatuses); 

  }
  
  getEnumValues(enumType: any): string[] {
    return Object.values(enumType).filter(value => typeof value === 'string') as string[];
  }
  ngOnInit(): void {
    console.log("Project status array:", this.Pstatus);
    console.log("Project data:", this.project);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    //console.log("Submitting project:", this.project);
    this.project.projectStatus = this.projectStatus; 
    this.projectService.UpdateProject(this.project).subscribe(updatedProject => {
     // console.log("Updated project:", updatedProject);

      this.dialogRef.close(updatedProject);
    });
  }
  isValidStartDate(): boolean {
    const today = new Date();
    return new Date(this.project.startdateProject) >= today;
  }

  isValidEndDate(): boolean {
    return new Date(this.project.enddateProject) > new Date(this.project.startdateProject);
  }
  
}
