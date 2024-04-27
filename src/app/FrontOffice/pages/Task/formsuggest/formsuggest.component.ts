import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/Models/User';
import { TaskService } from 'src/app/Services/task.service';
import { UserService } from 'src/app/Services/user.service';
import { UsersuggestinfoComponent } from '../usersuggestinfo/usersuggestinfo.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formsuggest',
  templateUrl: './formsuggest.component.html',
  styleUrls: ['./formsuggest.component.css']
})
export class FormsuggestComponent implements OnInit {
  users: User[] = [];
  tasksCount: number = 0;
  isAvailable: boolean = false;
  constructor(private userService: UserService,private dialogRef: MatDialogRef<FormsuggestComponent>,private taskService: TaskService,private router: Router,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userService.getCompetentUsers().subscribe(users => {
      this.users = users;
    });
  }
  onClose(): void {
    this.dialogRef.close(); 
  }
  
  openUsersuggestinfo(user: User): void {
    const dialogRef = this.dialog.open(UsersuggestinfoComponent, {
        width: '500px',
        data: { user } // Passer l'utilisateur sélectionné au composant modal
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            // Traiter le résultat si nécessaire
        }
    });
}
navigateToStatistics() {
  this.router.navigate(['Projectback/emplyeestat']);
}
}
