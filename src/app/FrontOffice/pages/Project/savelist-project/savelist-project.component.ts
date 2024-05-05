import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/Models/project';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { ProjectService } from 'src/app/Services/project.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProjectDetailsComponent } from '../project-details/project-details.component';

@Component({
  selector: 'app-savelist-project',
  templateUrl: './savelist-project.component.html',
  styleUrls: ['./savelist-project.component.css']
})
export class SavelistProjectComponent implements OnInit{
  wishlist: any[] = [];
  pageSize = 3;
  pageIndex = 0;

sliceFrom = 0; 
  sliceTo = this.pageSize;
  constructor(private toastr: ToastrService,private projectService: ProjectService, public dialog: MatDialog,private router: Router) {} // Inject ToastrService

  ngOnInit() {
    // Retrieve wishlist from local storage on component initialization
    this.loadWishlist();
  }

  saveWishlist() {
    // Save wishlist to local storage
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }

  loadWishlist() {
    // Load wishlist from local storage
    const storedWishlist = localStorage.getItem('wishlist');
    this.wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
  }

  addToWishlist(jobOffer: any) {
    // Add job offer to the wishlist
    this.wishlist.push(jobOffer);
    // Save the updated wishlist to local storage
    this.saveWishlist();
  }

  removeFromWishlist(jobOffer: any) {
    // Remove job offer from the wishlist
    this.wishlist = this.wishlist.filter(item => item !== jobOffer);
    // Save the updated wishlist to local storage
    this.saveWishlist();
    // Show success notification
    this.toastr.warning('Project removed from saved list!', 'Removed');
  }

  clearWishlist() {
    // Check if the wishlist is already empty
    if (this.wishlist.length === 0) {
      // If the wishlist is already empty, show an info notification
      this.toastr.info('List is already empty!', 'Info');
    } else {
      // Clear the entire wishlist
      this.wishlist = [];
      // Save the updated wishlist to local storage
      this.saveWishlist();
      // Show success notification
      this.toastr.error('List cleared successfully!', 'Cleared');
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.sliceProjects();
  }
  sliceProjects(): void {
    this.sliceFrom = this.pageIndex * this.pageSize;
    this.sliceTo = Math.min(this.sliceFrom + this.pageSize, this.wishlist.length); 
    console.log('sliceFrom:', this.sliceFrom, 'sliceTo:', this.sliceTo); 
  }

  getDisplayedProjects(): Project[] {
    return this.wishlist.slice(this.sliceFrom, this.sliceTo);
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
      height: '700px',
      width: '800px',
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
}
