import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Project } from 'src/app/Models/project';
import { StatusProject } from 'src/app/Models/status-project';
import { ProjectService } from 'src/app/Services/project.service';
import { TeamsmodalComponent } from '../teamsmodal/teamsmodal.component';
import { TaskService } from 'src/app/Services/task.service';
import { TaskStatus } from 'src/app/Models/task-status';

@Component({
  selector: 'app-projectsback',
  templateUrl: './projectsback.component.html',
  styleUrls: ['./projectsback.component.css']
})
export class ProjectsbackComponent implements OnInit,AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSize = 3;
  pageIndex = 0;
  searchQuery: string = '';
sliceFrom = 0; 
  sliceTo = this.pageSize;
  projects: Project[] = []; 
  StatusProject = StatusProject;
  project!: Project; 
  projectId!: number; // ID du projet actuel
  completedTasksCount: number = 0;
  nonCompletedTasksCount: number = 0;


  constructor(private projectService: ProjectService,private router: Router,public dialog: MatDialog,private taskService:TaskService) { } 
  getTasksForProject(projectId: number): void {
    this.taskService.getTasksByProjectId(projectId).subscribe(tasks => {
      const completedTasks = tasks.filter(task => 
        task.taskStatus === TaskStatus.COMPLETED || task.taskStatus === TaskStatus.CANCELLED
      );
  
      const nonCompletedTasks = tasks.filter(task => 
        task.taskStatus === TaskStatus.INPROGRESS || task.taskStatus === TaskStatus.TODO
      );
  
      // Mettre à jour les compteurs pour ce projet
      this.completedTasksCount = completedTasks.length;
      this.nonCompletedTasksCount = nonCompletedTasks.length;
    });
  }
  
  ngOnInit(): void {
    this.getAllProjects(); 
  
    this.projectService.getAllProjects().subscribe(projects => {
      this.projects = projects;
       
      this.sliceProjects();
    }); 
  }
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.sliceProjects();
  }
  sliceProjects(): void {
    this.sliceFrom = this.pageIndex * this.pageSize;
    this.sliceTo = Math.min(this.sliceFrom + this.pageSize, this.projects.length); 
    console.log('sliceFrom:', this.sliceFrom, 'sliceTo:', this.sliceTo); 
  }
  
  ngAfterViewInit(): void {
    console.log('Paginator:', this.paginator);

    if (this.paginator) {
      this.paginator.page.subscribe((event) => {
         
        this.pageIndex = event.pageIndex;
    
        this.sliceProjects();
      });
    }else {
      
    }
  }
  getDisplayedProjects(): Project[] {
    return this.projects.slice(this.sliceFrom, this.sliceTo);
  }
  
  


  getAllProjects(): void {
    if (this.searchQuery.trim() !== '') {
      this.projectService.searchProjects(this.searchQuery).subscribe(projects => {
        this.projects = projects;
        this.sliceProjects();
      });
    } else {
      this.projectService.getAllProjects().subscribe(projects => {
        this.projects = projects;
        this.sliceProjects();
            });
    }
    
  }
  
  onSearchChange(): void {
    this.getAllProjects(); 
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.sliceProjects();
      });
    }
  }
  generateRandomPercentage(): number {
    // Générer un nombre aléatoire entre 0 et 100 pour représenter le pourcentage
    const randomPercentage = Math.floor(Math.random() * 101);
  
    return randomPercentage;
  }
  navigateToStatistics() {
    this.router.navigate(['/Projectback/projectchart']);
  }
  
openteamModal(project: Project): void {
  const dialogRef = this.dialog.open(TeamsmodalComponent, {
    width: '400px',
    data: { project: project }  });

  dialogRef.afterClosed().subscribe(result => {
    // Traitez le résultat après la fermeture du modal si nécessaire
  });
}
/*
viewAssociatedkanban(): void {
  this.router.navigate(['/Projectback/kanbanback', this.project.projectId]); 
}
*/
viewAssociatedTasks(projectId: number): void {
  this.router.navigate(['/Projectback/taskback', projectId]); 
}
}
