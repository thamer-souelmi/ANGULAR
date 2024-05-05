import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddLeaveComponent } from 'src/app/BackOffice/Pages/add-leave/add-leave.component';
import { Leaves } from 'src/app/Models/leaves';
import { LeavesService } from 'src/app/Services/leaves.service';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})
export class LeaveComponent {

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
  constructor(private leaveService: LeavesService, private router: Router , private dialog: MatDialog) {


  }



  ngOnInit(){
    this.loadLeaves();

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
    if (confirm('Are you sure you want to delete this Leave?')) {
      this.leaveService.deleteLeave(userId).subscribe(
        () => {
          console.log('Leave deleted successfully.');
          alert('Leave deleted successfully.');
          this.loadLeaves();
        },
        error => {
          console.error('Error deleting Leave:', error);
        }
      );
    }
  }

  isUserDataValid(data: any[]): boolean {
    // Check if the data array contains at least one object with properties expected for a user object
    if (data.length === 0) {
      return false;
    }
    
    const firstItem = data[0];
    // Assuming a user object has properties like 'name', 'email', 'username', etc.
    return Object.keys(firstItem).includes('email') && 
         Object.keys(firstItem).includes('firstname') && 
         Object.keys(firstItem).includes('lastname') && 
         Object.keys(firstItem).includes('password') && 
         Object.keys(firstItem).includes('adresse') && 
         Object.keys(firstItem).includes('birthdate') && 
         Object.keys(firstItem).includes('phonenumber') && 
         Object.keys(firstItem).includes('gender')   /* Add more properties as needed */;
  }
  createNewTask(): void {
    const dialogRef = this.dialog.open(AddLeaveComponent, {
      width: '500px'
    });
  
    dialogRef.afterClosed().subscribe(result   => {
      if (result) {
      }
    });
  }
}

