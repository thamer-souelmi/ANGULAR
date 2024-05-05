import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  email: string="";
  token: string="";
  newPassword: string="";
  resetSuccess: boolean=false;
  resetError: boolean=false;
  siteKey: string= "6Lcom7kpAAAAAArX67LiteQ0DxzZg-CCyjkEHVZL";

  constructor(private passwordResetService: UserService,private toastr: ToastrService) { }

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

  resetPassword() {
    this.passwordResetService.resetPassword(this.token, this.newPassword).subscribe(
      () => {
        // Reset form fields and show success message
        this.token = '';
        this.newPassword = '';
        this.resetSuccess = true;
        this.resetError = false;
        this.toastr.success('Hello world!', 'Toastr fun!');
      },
      (error) => {
        console.error('Error resetting password:', error);
        this.resetSuccess = false;
        this.resetError = true;
      }
    );
  }
}
