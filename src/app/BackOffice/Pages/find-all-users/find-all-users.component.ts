import { Component } from '@angular/core';
import { User } from 'src/app/Models/User';


import {UserService} from "../../../Services/user.service";
import { Router } from '@angular/router';



@Component({
  selector: 'app-find-all-users',
  templateUrl: './find-all-users.component.html',
  styleUrls: ['./find-all-users.component.css']
})
export class FindAllUsersComponent {
  users : User[] = [];


  constructor(private userService: UserService,private router: Router ){}
  ngOnInit(){
    this.loadUsers();
  }
  loadUsers(){
    this.userService.findAllUsers().subscribe(users=>this.users=users);

  }
  editUser(userId: number) {
    // Navigate to the Edit User route with the user ID as a parameter
    this.router.navigate(['/admin/updateuser', userId]);
  }
  details(userId: number) {
    // Navigate to the Edit User route with the user ID as a parameter
    this.router.navigate(['/admin/userdetails', userId]);
  }
  delete(userId: number) {
    if (confirm('Are you sure you want to delete this User?')) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          console.log('User deleted successfully.');
          alert('User deleted successfully.');
          this.loadUsers();
        },
        error => {
          console.error('Error deleting User:', error);
        }
      );
    }
  }


}
