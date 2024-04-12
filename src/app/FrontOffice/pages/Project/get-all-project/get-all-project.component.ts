import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/Models/project';
import { ProjectService } from 'src/app/Services/project.service';
import { ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { ProjectDetailsComponent } from '../project-details/project-details.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ProjectCalendarModalComponent } from '../project-calendar-modal/project-calendar-modal.component';




@Component({
  selector: 'app-get-all-project',
  templateUrl: './get-all-project.component.html',
  styleUrls: ['./get-all-project.component.css']
})
export class GetAllProjectComponent implements OnInit,AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  projects: Project[] = [];
  projectId!: number;
  searchQuery: string = '';
  pageSize = 6;
  pageIndex = 0;

sliceFrom = 0; 
  sliceTo = this.pageSize;

  constructor(private projectService: ProjectService, public dialog: MatDialog,private router: Router) {}
  
  ngOnInit(): void {
    this.getAllProjects(); 
  
    this.projectService.getAllProjects().subscribe(projects => {
      this.projects = projects;
      console.log('Projects retrieved:', this.projects.length); 
      console.log('Initial sliceFrom:', this.sliceFrom, 'sliceTo:', this.sliceTo); 
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

  createNewProject(): void {
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }
  viewProjectDetails(project: Project): void {
    console.log("Bouton 'read more' cliqué avec succès !"); 
    const dialogRef = this.dialog.open(ProjectDetailsComponent, {
      width: 'auto',
      data: { project: project } 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
      }
    });
  }
  deleteProject(id: number): void {
    console.log("Deleting project with ID: ", id);
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe(() => {
        
        
        this.router.navigate(['/Project', 'getAllProject']);
      });
    }
  }
  openCalendarModal() {
    const dialogRef = this.dialog.open(ProjectCalendarModalComponent);
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  
  
  
  
}
