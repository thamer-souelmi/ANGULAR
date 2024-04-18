import { Component } from '@angular/core';
import {AuthService} from "../../Services/auth.service";
import {StorageService} from "../../Services/storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header-front',
  templateUrl: './header-front.component.html',
  styleUrls: ['./header-front.component.css']
})
export class HeaderFrontComponent {
  constructor(private authService: AuthService,private storageService : StorageService,private router : Router) {
  }
  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();

        this.router.navigate(['']);
      },
      error: err => {
        console.log(err);
      }
    });
  }

}
