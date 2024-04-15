import { Component } from '@angular/core';
import {AuthService} from "./Services/auth.service";
import {StorageService} from "./Services/storage.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ANGULAR';
  constructor(private authService: AuthService, private storageService: StorageService,
              private router : Router , private route : ActivatedRoute) { }
              isLoggedIn = false;
              isLoginFailed = false;  
  ngOnInit(): void {


    this.route.queryParams
    .subscribe(params => {
      if (params["code"] !== undefined) {
        this.authService.getToken(params["code"]).subscribe(result => {
          if (result === true) {
            this.isLoginFailed = false;
            this.isLoggedIn = true;
            this.router.navigate(['/home/home']);
              
        
          } else {
            this.router.navigate(['12421']);
          }
        });
      }
    }
  );

  }
}
