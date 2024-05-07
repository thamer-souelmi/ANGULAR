import { ChangeDetectorRef, Component } from '@angular/core';
import {AuthService} from "../../Services/auth.service";
import {StorageService} from "../../Services/storage.service";
import {ActivatedRoute, Router} from "@angular/router";
import { AddLeaveComponent } from 'src/app/BackOffice/Pages/add-leave/add-leave.component';
import { MatDialog } from '@angular/material/dialog';
import { LeavesService } from 'src/app/Services/leaves.service';
import { FormBuilder } from '@angular/forms';
import { AttendanceService } from 'src/app/Services/attendance.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { ScreenshotService } from 'src/app/Services/Screenshot.service';

@Component({
  selector: 'app-header-front',
  templateUrl: './header-front.component.html',
  styleUrls: ['./header-front.component.css']
})
export class HeaderFrontComponent {
  constructor( private screenshotService : ScreenshotService, private localStorageService: LocalStorageService,private attendanceService: AttendanceService,private authService: AuthService,private storageService : StorageService,private router : Router,private userService: LeavesService, 
) {
  }
  logout(): void {
    this.removeAttendance();
    this.stopAttendance(); // Arrêter l'attendance lors de la déconnexion
    
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();
        this.screenshotService.resetPermission();

        this.router.navigate(['']);
      },
      error: err => {
        console.log(err);
      }
    });
  }
  removeAttendance(): void {
    // Arrêter l'attendance uniquement si l'ID de l'attendance est présent dans le local storage
    const attendanceIdend = this.localStorageService.getItem('attendanceId');
    if (attendanceIdend) {
      this.attendanceService.deleteAttendance(attendanceIdend-1).subscribe(
        () => {
          console.log('Attendance deleted successfully.');
        },
        (error) => {
          console.error('Failed to delete attendance:', error);
        }
      );
    }
}
  stopAttendance(): void {
    // Arrêter l'attendance uniquement si l'ID de l'attendance est présent dans le local storage
    const attendanceId = this.localStorageService.getItem('attendanceId');
    console.log('-----------------', attendanceId);
    if (attendanceId) {
      this.attendanceService.endAttendance(attendanceId).subscribe(
        () => {
          console.log('Attendance ended successfully.');
          this.localStorageService.removeItem('attendanceId');
        },
        (error) => {
          console.error('Failed to end attendance:', error);
        }
      );
    }
}
}
// import { Component } from '@angular/core';
// import {AuthService} from "../../Services/auth.service";
// import {StorageService} from "../../Services/storage.service";
// import {Router} from "@angular/router";

// @Component({
//   selector: 'app-header-front',
//   templateUrl: './header-front.component.html',
//   styleUrls: ['./header-front.component.css']
// })
// export class HeaderFrontComponent {
//   constructor(private authService: AuthService,private storageService : StorageService,private router : Router) {
//   }
//   logout(): void {
//     this.authService.logout().subscribe({
//       next: res => {
//         console.log(res);
//         this.storageService.clean();

//         this.router.navigate(['']);
//       },
//       error: err => {
//         console.log(err);
//       }
//     });
//   }

// }
