import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { StorageService } from 'src/app/Services/storage.service';
import {ActivatedRoute, Router} from "@angular/router";
import { WebsocketServiceService } from 'src/app/Services/websocket-service.service';

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
              private router : Router, private route: ActivatedRoute,
              private websocketService: WebsocketServiceService) { }

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
    this.websocketService.startRecognition();

    // Listen for login process completed event
    this.websocketService.onRecognitionResults().subscribe((data) => {

      // Handle the response data here
      console.log('Login process completed with user ID:', data);
      // Perform actions indicating a successful login, e.g., redirect to another page
    }, (error) => {
      console.error('Error occurred during login process:', error);
      // Perform actions indicating an error, e.g., display an error message to the user
    });

    const { email, password } = this.form;

    this.authService.login(email, password).subscribe({
      next: data => {
        if(data){
          
        this.storageService.saveUser(data);
        const id = this.storageService.getUser().id;


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
