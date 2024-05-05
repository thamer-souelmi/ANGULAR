import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/Models/project';
import { Task } from 'src/app/Models/task';
import { TaskService } from 'src/app/Services/task.service';

@Component({
  selector: 'app-teamsmodal',
  templateUrl: './teamsmodal.component.html',
  styleUrls: ['./teamsmodal.component.css']
})
export class TeamsmodalComponent  {
  project: Project;
  tasks: Task[] = [];

  searchQuery: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ts: TaskService) {
    this.project = data.project;
    console.log('Project:', this.project); // Vérifiez les données du projet dans la console
    this.getTasksByProjectId(this.project.projectId); // Récupérer les tâches pour ce projet
  }

  getTasksByProjectId(projectId: number): void {
    this.ts.getTasksByProjectId(projectId).subscribe(tasks => {
      this.tasks = tasks;
      // Les tâches pour ce projet sont maintenant disponibles dans this.tasks
    });
  }
  search(event: any): void {
    const query: string = event.target.value;
    if (!query.trim()) {
      // If the query is empty, show all tasks
      this.getTasksByProjectId(this.project.projectId);
      return;
    }
    // Filter tasks based on first name or last name
    this.tasks = this.tasks.filter(task =>
      task.employeeTask?.firstname.toLowerCase().includes(query.toLowerCase()) ||
      task.employeeTask?.lastname.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  
}
