// // // import { Component, OnInit } from '@angular/core';
// // // import { HttpClient } from '@angular/common/http';

// // // @Component({
// // //   selector: 'app-screenshot-display',
// // //   templateUrl: './screenshot-display.component.html',
// // //   styleUrls: ['./screenshot-display.component.css']
// // // })
// // // export class ScreenshotDisplayComponent implements OnInit {

// // //   userId: number = 2; // Example user ID
// // //   screenshots: any[] = [];

// // //   constructor(private http: HttpClient) { }

// // //   ngOnInit(): void {
// // //     this.getScreenshots();
// // //   }

// // //   getScreenshots() {
// // //     this.http.get<any[]>(`http://localhost:8082/api/screenshots/${this.userId}`).subscribe(
// // //       response => {
// // //         this.screenshots = response;
// // //       },
// // //       error => {
// // //         console.error('Failed to fetch screenshots:', error);
// // //       }
// // //     );
// // //   }
// // // }

// // // screenshot-display.component.ts
// // import { Component, OnInit } from '@angular/core';
// // import { HttpClient } from '@angular/common/http';
// // import { UserService } from 'src/app/Services/user.service';
// // import { User } from 'src/app/Models/User';

// // @Component({
// //   selector: 'app-screenshot-display',
// //   templateUrl: './screenshot-display.component.html',
// //   styleUrls: ['./screenshot-display.component.css']
// // })
// // export class ScreenshotDisplayComponent implements OnInit {

// //   userId: number = 2; // Example user ID
// //   screenshots: string[] = []; // Assuming URLs will be returned
// //   users!: User[];

// //   constructor(private http: HttpClient,private userservcie : UserService) { }

// //   ngOnInit(): void {
// //     this.getScreenshots();
// //   }
// //   loadUsers(){
// //     this.userservcie.findAllUsers().subscribe(
// //       users => {
// //         this.users = users;
// //         this.users.forEach(user => {
// //           this.getImage(user.userId);
// //         });
// //       },
// //       error => {
// //         console.error('Error loading users:', error);
// //       }
// //     );
// //   }
// //   getScreenshots() {
// //     this.http.get<string[]>(`http://localhost:8082/api/screenshots/${this.userId}`).subscribe(
// //       response => {
// //         this.screenshots = response;
// //       },
// //       error => {
// //         console.error('Failed to fetch screenshots:', error);
// //       }
// //     );
// //   }
// // }

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

//   selectedUserId: number | null = null; // Initialize as null
//   screenshots: string[] = [];
//   users: User[] | null = null; // Initialize as null

//   constructor(private http: HttpClient, private userService: UserService) { }

//   ngOnInit(): void {
//     this.loadUsers();
//   }

//   loadUsers() {
//     this.userService.findAllUsers().subscribe(
//       users => {
//         this.users = users;
//       },
//       error => {
//         console.error('Error loading users:', error);
//       }
//     );
//   }

//   onSelectUser(event: any) {
//     this.selectedUserId = event.target.value;
//     this.getScreenshots();
//   }

//   getScreenshots() {
//     if (this.selectedUserId !== null) {
//       this.http.get<string[]>(`http://localhost:8082/api/screenshots/${this.selectedUserId}`).subscribe(
//         response => {
//           this.screenshots = response;
//         },
//         error => {
//           console.error('Failed to fetch screenshots for user ID', this.selectedUserId, ':', error);
//         }
//       );
//     } else {
//       console.error('No user selected.');
//     }
//   }

//   callPythonScript(screenshots: string[]) {
//     // Make a POST request to the Python script endpoint with the image URLs
//     this.http.post<any>('http://localhost:5000/compare-images', { image_urls: screenshots }).subscribe(
//       response => {
//         console.log('Python script response:', response);
//         // Process the response as needed
//       },
//       error => {
//         console.error('Failed to call Python script:', error);
//       }
//     );
//   }
  
// }
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/Services/user.service';
import { User } from 'src/app/Models/User';
import { AttendanceService } from 'src/app/Services/attendance.service';
import { Attendance } from 'src/app/Models/Attendance';

@Component({
  selector: 'app-screenshot-display',
  templateUrl: './screenshot-display.component.html',
  styleUrls: ['./screenshot-display.component.css']
})
export class ScreenshotDisplayComponent implements OnInit {

  selectedUserId: number | null = null; // Initialize as null
  screenshots: string[] = [];
  attandances: Attendance[]= [];
  workedMinutesemployee: number | null= null;
  workedHoursemployee: number | null= null;

  users: User[] | null = null; // Initialize as null
  comparisonResult: string | null = null; // Initialize as null

  constructor(private attendanceservice : AttendanceService,private http: HttpClient, private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }
  approve(){
    if (this.selectedUserId !== null) {
    this.attendanceservice.approve(this.selectedUserId).subscribe(
      reponse => {
        console.log(reponse);
      },
      error => {
        console.error('Failed to approve employee ID', this.selectedUserId, ':', error);
      }
    )
    }
  }
loadAttendances(){
  if (this.selectedUserId !== null) {

  this.attendanceservice.getAttendanceByEmployeeId(this.selectedUserId).subscribe(
    attandances => {
      this.attandances= attandances;
      this.workedMinutesemployee = 0;
      for (let attendance of this.attandances) {
        this.workedMinutesemployee += attendance.workedHours;
      }
      this.workedHoursemployee = Math.round(this.workedMinutesemployee/60);
    },
    error => {
      console.error('Failed to fetch Attandance for the employee ID', this.selectedUserId, ':', error);
    }
  )
  }
}
// calculateWorkedHours() {
//   for (const attendance of this.attandances) {
//     this.workedHoursemployee += attendance.workedHours;
//   }
// }
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
    this.loadAttendances();
    // this.calculateWorkedHours();
  }

  getScreenshots() {
    if (this.selectedUserId !== null) {
      this.http.get<string[]>(`http://localhost:8082/api/screenshots/${this.selectedUserId}`).subscribe(
        response => {
          this.screenshots = response;
          // Call the Python script endpoint when screenshots are retrieved
          this.callPythonScript(this.screenshots);
        },
        error => {
          console.error('Failed to fetch screenshots for user ID', this.selectedUserId, ':', error);
        }
      );
    } else {
      console.error('No user selected.');
    }
  }

  callPythonScript(screenshots: string[]) {
    // Make a POST request to the Python script endpoint with the image URLs
    this.http.post<any>('http://localhost:5000/compare-images', { image_urls: screenshots }).subscribe(
      response => {
        console.log('Python script response:', response);
        // Process the response and update the comparisonResult accordingly
        if (response && response.similarity !== undefined) {
          // If similarity score is received, set comparisonResult to the score
          this.comparisonResult = `Similarity score: ${response.similarity}`;
        } else if (response && response.error) {
          // If an error message is received, set comparisonResult to the error message
          this.comparisonResult = response.error;
        }
      },
      error => {
        console.error('Failed to call Python script:', error);
      }
    );
  }
  isSimilarityHigh(): boolean {
    if (this.comparisonResult) {
      const similarity = parseFloat(this.comparisonResult.split(':')[1].trim());
      return similarity >= 0.9;
    }
    return false;
  }
  
  isSimilarityLow(): boolean {
    if (this.comparisonResult) {
      const similarity = parseFloat(this.comparisonResult.split(':')[1].trim());
      return similarity < 0.9;
    }
    return false;
  }
  
}

