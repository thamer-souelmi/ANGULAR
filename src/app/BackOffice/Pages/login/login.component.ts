import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { StorageService } from 'src/app/Services/storage.service';
import { ActivatedRoute, Router } from "@angular/router";
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { AttendanceService } from 'src/app/Services/attendance.service';
import { WebsocketServiceService } from 'src/app/Services/websocket-service.service';
import { ToastrService } from 'ngx-toastr';

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
              private router: Router, private route: ActivatedRoute, private localStorageService: LocalStorageService,private websocketService: WebsocketServiceService,private toastr: ToastrService) { }

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
        if (data){
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;


        // Assuming the attendance ID is obtained from the login response or another source
        this.recognizeFaceAndStartAttendance(); // Adjust this line based on how you obtain the attendance ID


        // Call startAttendance only after setting the attendance ID


        // Navigation logic based on roles
        let isAdmin = this.roles.includes('admin');
        this.router.navigate(isAdmin ? ['back/findall'] : ['home']);}
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
  recognizeFaceAndStartAttendance(): void {
    console.log("tessssssssssssssssst")
    // Trigger face recognition process
    this.websocketService.startRecognition();
    console.log("///////////////////////")
  
    // Listen for recognition results asynchronously
    this.websocketService.onRecognitionResults().subscribe((data: any) => {
      // Extract the user ID from the recognition results data
      const recognitionUserId = data;
      console.log(recognitionUserId)
    
      // Get the ID of the logged-in user from the storage service
      const loggedInUserId = this.storageService.getUser().id;
    
      // Compare the recognition user ID with the logged-in user ID
      if (recognitionUserId === loggedInUserId) {
        // Face recognition successful, start attendance
        this.startAttendance();
        this.toastr.success('Face recognition success');
      } else {
        console.log('Face recognition failed for the current user.');
        this.toastr.error('Face recognition failed for the current user.');
        // Handle failed face recognition, e.g., display an error message
      }
    }, (error) => {
      console.error('Error occurred during login process:', error);
      // Perform actions indicating an error, e.g., display an error message to the user
    });
    
  }
  

  navigateToCorrectPage(): void {
    let isAdmin = this.roles.includes('admin');
    this.router.navigate(isAdmin ? ['back/findall'] : ['home']);
  }
}
