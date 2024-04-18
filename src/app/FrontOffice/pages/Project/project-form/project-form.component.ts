import { Component, OnInit, ViewChild } from '@angular/core';
import { Project } from 'src/app/Models/project';
import { ProjectService } from 'src/app/Services/project.service';
import { MatDialogRef } from '@angular/material/dialog';
import { StatusProject } from 'src/app/Models/status-project';
import { User } from 'src/app/Models/User';
import { UserService } from 'src/app/Services/user.service';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/Services/file-upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  @ViewChild('projectForm') projectForm!: NgForm;  newProject: Project = {} as Project; 
  projectManagers: User[] = [];
  selectedmanager!: User; 
  selectedFiles?: FileList;
  fileName?: Observable<any>;
  previews: string[] = [];
  progressInfos: any[] = [];
  message: string[] = [];
  Pstatus :string[] =[ 'planned', 'in_progress','completed', 'on_Hold', 'canceled']
  selectedProjectStatus: StatusProject = StatusProject.planned; 
  statusOptions = Object.keys(StatusProject).map(key => StatusProject[key as keyof typeof StatusProject]) ; 
  constructor(private projectService: ProjectService, private dialogRef: MatDialogRef<ProjectFormComponent>,private userService: UserService,private fileservice:FileUploadService) { }

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
    
    const newc: Project = this.projectForm.value as Project;
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      newc.fileName = this.selectedFiles[0].name;
    }
    this.newProject.projectStatus = this.selectedProjectStatus;
    this.newProject.projectManager=this.selectedmanager;
    console.log('Selected Project Manager:', this.selectedmanager);
    this.projectService.AddProject(this.newProject).subscribe(project => {
      this.dialogRef.close(true);
    });
    this.uploadFiles();

  }
  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }
  uploadFiles(): void {
    this.message = [];

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }
  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    if (file) {
      this.fileservice.upload(file).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
            this.fileName = this.fileservice.getFiles();
          }
        },
        error: (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        }});
    }
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