import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { StorageService } from 'src/app/Services/storage.service';
import { ActivatedRoute, Router } from "@angular/router";
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { AttendanceService } from 'src/app/Services/attendance.service';

@Component({
 selector: 'app-login-component',
 templateUrl: './login.component.html',
 styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 url: string = "";
 form: any = {
    email: null,
    password: null
 };
 isLoggedIn = false;
 isLoginFailed = false;
 errorMessage = '';
 roles: string[] = [];

 constructor(private authService: AuthService, private storageService: StorageService, private attendance: AttendanceService,
              private router: Router, private route: ActivatedRoute, private localStorageService: LocalStorageService) { }

 ngOnInit(): void {
    // const attendanceId = this.localStorageService.getItem('attendanceId');

    this.authService.get().subscribe((data: any) => this.url = data.authURL);
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      // const attendanceId=this.startAttendance(); // Corrected: Removed unnecessary condition
      // this.localStorageService.setItem('attendanceId',attendanceId);
      const roles = this.storageService.getUser().roles;
      let isAdmin = false;
      for (const role of roles) {
        if (role === "admin") {
          isAdmin = true;
          break;
        }
      }

      if (isAdmin) {
        this.router.navigate(['back/findall']);
      } else {
        this.router.navigate(['home']);
      }
    }
 }

 onSubmit(): void {
  const { email, password } = this.form;
 
  this.authService.login(email, password).subscribe({
     next: data => {
       this.storageService.saveUser(data);
       this.isLoginFailed = false;
       this.isLoggedIn = true;
       this.roles = this.storageService.getUser().roles;
       
        
       // Assuming the attendance ID is obtained from the login response or another source
        this.startAttendance(); // Adjust this line based on how you obtain the attendance ID
 
       
         // Call startAttendance only after setting the attendance ID
       
 
       // Navigation logic based on roles
       let isAdmin = this.roles.includes('admin');
       this.router.navigate(isAdmin ? ['back/findall'] : ['home']);
     },
     error: err => {
       this.errorMessage = err.error.message;
       this.isLoginFailed = true;
     }
  });
 }
 
 
 startAttendance(): void {
  // Start attendance only if the user is logged in
  if (this.isLoggedIn) {
    // Check if attendance already started for this session
    const attendanceId = this.localStorageService.getItem('attendanceId');
    if (!attendanceId) {
      this.attendance.startAttendance(this.storageService.getUser().id).subscribe(
        (response: number) => {
          console.log('Attendance started successfully.');
          console.log('----------------', response);
          this.localStorageService.setItem('attendanceId', response);
          // Save attendanceId to local storage after starting attendance
        },
        (error) => {
          console.error('Failed to start attendance:', error);
        }
      );
    }
  }
}

 navigateToCorrectPage(): void {
    let isAdmin = this.roles.includes('admin');
    this.router.navigate(isAdmin ? ['back/findall'] : ['home']);
 }
}



/**
 * import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { StorageService } from 'src/app/Services/storage.service';
import {ActivatedRoute, Router} from "@angular/router";
import { AttendanceService } from 'src/app/Services/attendance.service';
import { Attendance } from 'src/app/Models/Attendance';
import { User } from 'src/app/Models/User';
import { Gender } from 'src/app/Models/gender';
@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  url: string = "";
    form: any = {
    email: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
 


  constructor(private authService: AuthService, private storageService: StorageService,
              private router : Router, private route: ActivatedRoute,private attendanceService: AttendanceService) { }

  ngOnInit(): void {
    

    this.authService.get().subscribe((data: any) => this.url = data.authURL);
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      const roles = this.storageService.getUser().roles;
      let isAdmin = false;
      for (const role of roles) {
        if (role === "admin") {
          isAdmin = true;
          break; // Once "admin" role is found, no need to continue the loop
        }
      }
     



      if (isAdmin) {
        this.router.navigate(['back/findall']);
      } else {
        this.router.navigate(['home']);
      }
    }
      
}
  

onSubmit(): void {
  const { email, password } = this.form;

  this.authService.login(email, password).subscribe({
    next: data => {
      this.storageService.saveUser(data);
      this.isLoginFailed = false;
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
      let isAdmin = this.roles.includes('admin');

      if (isAdmin) {
        this.router.navigate(['back/findall']);
      } else {
        this.router.navigate(['home']);
      }

      // Démarrer le timer d'attendance après la connexion
      this.startAttendance();
    },
    error: err => {
      this.errorMessage = err.error.message;
      this.isLoginFailed = true;
    }
  });
}

startAttendance(): void {
  const userId = this.storageService.getUser().id;
  this.attendanceService.startAttendance(userId).subscribe(
    (response: number) => {
      console.log('Attendance started successfully.');
      // Vous pouvez gérer le succès de la démarrage de l'attendance ici
    },
    (error) => {
      console.error('Failed to start attendance:', error);
      // Gérer l'échec du démarrage de l'attendance ici
    }
  );
}
  navigateToCorrectPage(): void {
    let isAdmin = this.roles.includes('admin');
    this.router.navigate(isAdmin ? ['back/findall'] : ['home']);
  }
}

 */