import { ChangeDetectorRef, Component } from '@angular/core';
import {AuthService} from "../../Services/auth.service";
import {StorageService} from "../../Services/storage.service";
import {ActivatedRoute, Router} from "@angular/router";
import { AddLeaveComponent } from 'src/app/BackOffice/Pages/add-leave/add-leave.component';
import { MatDialog } from '@angular/material/dialog';
import { LeavesService } from 'src/app/Services/leaves.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-header-front',
  templateUrl: './header-front.component.html',
  styleUrls: ['./header-front.component.css']
})
export class HeaderFrontComponent {
  constructor(private authService: AuthService,private storageService : StorageService,private router : Router,private userService: LeavesService, 
) {
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
