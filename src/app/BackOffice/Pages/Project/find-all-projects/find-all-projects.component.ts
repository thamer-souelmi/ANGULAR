import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/Models/project';
import { ProjectService } from 'src/app/Services/project.service';

@Component({
  selector: 'app-find-all-projects',
  templateUrl: './find-all-projects.component.html',
  styleUrls: ['./find-all-projects.component.css']
})
export class FindAllProjectsComponent {
  constructor(private ps:ProjectService,private router: Router){
  }
  listProjects:Project[]=[];
  ngOnInit(){
    this.loadProjects();
  }
  loadProjects(){
    this.ps.getAllProjects().subscribe(project=>this.listProjects=project); 
  }
 

}
