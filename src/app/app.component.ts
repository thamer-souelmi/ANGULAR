import { Component } from '@angular/core';
import {AuthService} from "./Services/auth.service";
import {StorageService} from "./Services/storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ANGULAR';
  constructor(private authService: AuthService, private storageService: StorageService,
              private router : Router ) { }
  ngOnInit(): void {
    if (!this.storageService.isLoggedIn())
      this.router.navigate(['']);


  }
}
