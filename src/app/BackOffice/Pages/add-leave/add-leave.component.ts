import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/Models/User';
import { Leaves } from 'src/app/Models/leaves';
import { LeavesService } from 'src/app/Services/leaves.service';
import { StorageService } from 'src/app/Services/storage.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-add-leave',
  templateUrl: './add-leave.component.html',
  styleUrls: ['./add-leave.component.css']
})
export class AddLeaveComponent implements OnInit {
  user: User[] = []; 
  leave!: Leaves; 
 // roles: Role[] = []; 
 id!: number ;
  


  newLeave: Leaves = new Leaves(); 
 


  constructor(private leavesservice: LeavesService, private dialogRef: MatDialogRef<AddLeaveComponent>,private storageService: StorageService) { }

  ngOnInit(): void {
   
   // this.loadRole();
   this.id = this.storageService.getUser().id;
   console.log("tttttttttttttt",this.id)    
  }
  


  
 
  onSubmit(): void {
    console.log('The leave has been added', this.newLeave);

    this.leavesservice.addLeave(this.newLeave,this.id).subscribe(() => {
      console.log('The leave has been added', this.newLeave);
      this.dialogRef.close(true); 
    });
  }

  onClose(): void {
    this.dialogRef.close(); 
  }

  

  

}
