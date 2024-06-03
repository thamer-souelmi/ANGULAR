import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Leaves } from 'src/app/Models/leaves';
import { AuthService } from 'src/app/Services/auth.service';
import { LeavesService } from 'src/app/Services/leaves.service';
import { StorageService } from 'src/app/Services/storage.service';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent {
  message: string[] = [];

  previews: string[] = [];
  Leaves : Leaves[] = [];
  @ViewChild('locationSelect') locationSelect: ElementRef | undefined;
  searchtext:any;
  leaves1: Leaves[] = [];
  @ViewChild('myModal') myModal!: ElementRef;
  @ViewChild('warningSuccessModal') warningSuccessModal!: ElementRef;
  warningMessage: string = '';
  @ViewChild('addUserModal') addUserModal!: ElementRef;
  ExcelData : any ;
  id!:number;
  constructor(private leaveService: LeavesService, private router: Router,private storageService : StorageService) {


  }



  ngOnInit(){
    this.loadLeaves();
    this.id = this.storageService.getUser().id;

  }
  loadLeaves(){
    this.leaveService.findAllLeaves().subscribe(
      leaves => {
        this.leaves1 = leaves;

      },
      error => {
        console.error('Error loading users:', error);
      }
    );
  }
  editUser(userId: number) {
    // Navigate to the Edit User route with the user ID as a parameter
    this.router.navigate(['/back/updateuser', userId]);
  }
  details(userId: number) {
    // Navigate to the Edit User route with the user ID as a parameter
    
    this.router.navigate(['/back/leavedetails', userId]);
  }
  delete(userId: number) {
    if (confirm('Are you sure you want to delete this User?')) {
      this.leaveService.getLeaveById(userId).subscribe(
        () => {
          console.log('User deleted successfully.');
          alert('User deleted successfully.');
          this.loadLeaves();
        },
        error => {
          console.error('Error deleting User:', error);
        }
      );
    }
  }
  approuveLeave(leave : Leaves){
  this.leaveService.approuveLeave(leave,this.id).subscribe({ next: (response) => {
    // Handle the response if needed
    
    console.log('Leave approved successfully:', response);
  },
  error: (error) => {
    // Handle the error if the leave approval fails
    console.error('Failed to approve leave:', error);
  }
}) ;
}

}
