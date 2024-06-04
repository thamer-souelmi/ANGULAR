import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { UserService } from 'src/app/Services/user.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/Services/storage.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent  implements OnInit {
  token: string="";
  password: string="";
  email: string="";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: UserService
    ,private toastr: ToastrService,
    private storageService : StorageService
  )  {
    const tokenParam = this.route.snapshot.paramMap.get('token');
    this.token = tokenParam ? tokenParam : ''; // Provide a default value if tokenParam is null
  }
  ngOnInit() {
    const tokenParam = this.route.snapshot.paramMap.get('token');
    this.token = tokenParam ? tokenParam : '';
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
  resetPassword() {
    this.authService.resetPasswordt(this.token, this.password).subscribe(
      () => {
        // Reset successful, navigate to login page
        this.router.navigateByUrl('');
      },
      error => {
        // Handle error
        console.error(error);
      }
      
    );
    this.router.navigateByUrl('');
    this.toastr.success('Password reset successfully.');


  }
}
