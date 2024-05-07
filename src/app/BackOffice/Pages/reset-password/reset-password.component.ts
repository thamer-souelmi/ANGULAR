import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { UserService } from 'src/app/Services/user.service';

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
  )  {
    const tokenParam = this.route.snapshot.paramMap.get('token');
    this.token = tokenParam ? tokenParam : ''; // Provide a default value if tokenParam is null
  }
  ngOnInit() {
    const tokenParam = this.route.snapshot.paramMap.get('token');
    this.token = tokenParam ? tokenParam : '';
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
  }
}
