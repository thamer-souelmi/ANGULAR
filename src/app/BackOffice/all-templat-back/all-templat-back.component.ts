import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/Services/storage.service';

@Component({
  selector: 'app-all-templat-back',
  templateUrl: './all-templat-back.component.html',
  styleUrls: ['./all-templat-back.component.css']
})
export class AllTemplatBackComponent  implements OnInit {
  constructor(private storageService: StorageService, private router: Router) {
  }

  ngOnInit() {
    const roles = this.storageService.getUser().roles;

    let isAdmin = false;
    for (const role of roles) {
      if (role === "admin") {
        isAdmin = true;
        break; // Once "admin" role is found, no need to continue the loop
      }
    }
    if (!this.storageService.isLoggedIn())
      this.router.navigate(['']);
    else if (isAdmin) {
      // this.router.navigate(['back/findall']);
    } else {
      // this.router.navigate(['home']);
    }
  }
}




