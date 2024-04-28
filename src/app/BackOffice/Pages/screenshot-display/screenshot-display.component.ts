// // import { Component, OnInit } from '@angular/core';
// // import { HttpClient } from '@angular/common/http';

// // @Component({
// //   selector: 'app-screenshot-display',
// //   templateUrl: './screenshot-display.component.html',
// //   styleUrls: ['./screenshot-display.component.css']
// // })
// // export class ScreenshotDisplayComponent implements OnInit {

// //   userId: number = 2; // Example user ID
// //   screenshots: any[] = [];

// //   constructor(private http: HttpClient) { }

// //   ngOnInit(): void {
// //     this.getScreenshots();
// //   }

// //   getScreenshots() {
// //     this.http.get<any[]>(`http://localhost:8082/api/screenshots/${this.userId}`).subscribe(
// //       response => {
// //         this.screenshots = response;
// //       },
// //       error => {
// //         console.error('Failed to fetch screenshots:', error);
// //       }
// //     );
// //   }
// // }

// // screenshot-display.component.ts
// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { UserService } from 'src/app/Services/user.service';
// import { User } from 'src/app/Models/User';

// @Component({
//   selector: 'app-screenshot-display',
//   templateUrl: './screenshot-display.component.html',
//   styleUrls: ['./screenshot-display.component.css']
// })
// export class ScreenshotDisplayComponent implements OnInit {

//   userId: number = 2; // Example user ID
//   screenshots: string[] = []; // Assuming URLs will be returned
//   users!: User[];

//   constructor(private http: HttpClient,private userservcie : UserService) { }

//   ngOnInit(): void {
//     this.getScreenshots();
//   }
//   loadUsers(){
//     this.userservcie.findAllUsers().subscribe(
//       users => {
//         this.users = users;
//         this.users.forEach(user => {
//           this.getImage(user.userId);
//         });
//       },
//       error => {
//         console.error('Error loading users:', error);
//       }
//     );
//   }
//   getScreenshots() {
//     this.http.get<string[]>(`http://localhost:8082/api/screenshots/${this.userId}`).subscribe(
//       response => {
//         this.screenshots = response;
//       },
//       error => {
//         console.error('Failed to fetch screenshots:', error);
//       }
//     );
//   }
// }

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/Services/user.service';
import { User } from 'src/app/Models/User';

@Component({
  selector: 'app-screenshot-display',
  templateUrl: './screenshot-display.component.html',
  styleUrls: ['./screenshot-display.component.css']
})
export class ScreenshotDisplayComponent implements OnInit {

  selectedUserId: number | null = null; // Initialize as null
  screenshots: string[] = [];
  users: User[] | null = null; // Initialize as null

  constructor(private http: HttpClient, private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.findAllUsers().subscribe(
      users => {
        this.users = users;
      },
      error => {
        console.error('Error loading users:', error);
      }
    );
  }

  onSelectUser(event: any) {
    this.selectedUserId = event.target.value;
    this.getScreenshots();
  }

  getScreenshots() {
    if (this.selectedUserId !== null) {
      this.http.get<string[]>(`http://localhost:8082/api/screenshots/${this.selectedUserId}`).subscribe(
        response => {
          this.screenshots = response;
        },
        error => {
          console.error('Failed to fetch screenshots for user ID', this.selectedUserId, ':', error);
        }
      );
    } else {
      console.error('No user selected.');
    }
  }
}

