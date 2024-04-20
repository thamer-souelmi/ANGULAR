import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/Models/User';
import { TaskService } from 'src/app/Services/task.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-usersuggestinfo',
  templateUrl: './usersuggestinfo.component.html',
  styleUrls: ['./usersuggestinfo.component.css']
})
export class UsersuggestinfoComponent  implements OnInit{
  tasksCount: number = 0;
  isAvailable: boolean = false;
  users: User[] = [];
  constructor(private userService: UserService,private dialogRef: MatDialogRef<UsersuggestinfoComponent>,private taskService: TaskService, @Inject(MAT_DIALOG_DATA) public data: { user: User }) { }


  ngOnInit(): void {
    if (this.data && this.data.user) {
        this.getUserTaskInfo(this.data.user);
    }
}
getUserTaskInfo(user: User): void {
 // console.log('User clicked:', user);
  this.taskService.getCountByEmployeeTask(user.userId).subscribe(taskCount => {
    //  console.log('Task count:', taskCount);
      this.tasksCount = taskCount;
  });

 
  this.taskService.checkAvailableTasks(user.userId).subscribe(isAvailable => {
      //console.log('Is available:', isAvailable);
      this.isAvailable = isAvailable;
  });
}
  onClose(): void {
    this.dialogRef.close(); 
  }
}
