import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { StorageService } from 'src/app/Services/storage.service';
import {ActivatedRoute, Router} from "@angular/router";

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
  isLoginFailed = true;
  errorMessage = '';
  roles: string[] = [];
 


  constructor(private authService: AuthService, private storageService: StorageService,
              private router : Router, private route: ActivatedRoute) { }

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
        this.router.navigate(['back/dashboard']);
      } else {
        this.router.navigate(['home']);
      }
    }
  
}
  

  onSubmit(): void {
    const { email, password } = this.form;

    this.authService.login(email, password).subscribe({
      next: data => {
        if(data){
        this.storageService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        //this.roles = this.storageService.getUser().roles;
        let isAdmin = false;
        const roles = this.storageService.getUser().roles;
        for (const role of roles) {
          if (role === "admin") {
            isAdmin = true;
            break; // Once "admin" role is found, no need to continue the loop
          }
        }

        if (isAdmin) {
          this.router.navigate(['back/dashboard']);
        } else {
          this.router.navigate(['home']);
        }}},
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });



  }

  navigateToCorrectPage(): void {
    let isAdmin = this.roles.includes('admin');
    this.router.navigate(isAdmin ? ['back/findall'] : ['home']);
  }
}
