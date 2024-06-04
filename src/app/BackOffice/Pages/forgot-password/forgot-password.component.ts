import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/Services/storage.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  email: string="";
  token: string="";
  newPassword: string="";
  resetSuccess: boolean=false;
  resetError: boolean=false;
  siteKey: string= "6Lcom7kpAAAAAArX67LiteQ0DxzZg-CCyjkEHVZL";

  constructor(private passwordResetService: UserService,private toastr: ToastrService,    private router: Router,
    private storageService: StorageService) { }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      
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

  initiatePasswordReset() {
    this.passwordResetService.initiatePasswordReset(this.email).subscribe(
      () => {
        this.resetSuccess = true;
        this.resetError = false;
       
      },
      (error) => {
        console.error('Error initiating password reset:', error);
        this.resetSuccess = false;
        this.resetError = true;
      }
    );
  }


}
