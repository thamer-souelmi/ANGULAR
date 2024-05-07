import { Component } from '@angular/core';
import {Observable} from "rxjs";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import {StorageService} from "../../Services/storage.service";
import {AuthService} from "../../Services/auth.service";
import {Router} from "@angular/router";
import { User } from 'src/app/Models/User';
import { UserService } from 'src/app/Services/user.service';
import { HttpResponse } from '@angular/common/http';
interface sidebarMenu {
  link: string;
  icon: string;
  menu: string;
}
@Component({
  selector: 'app-sidebar-back',
  templateUrl: './sidebar-back.component.html',
  styleUrls: ['./sidebar-back.component.css']
})
export class SidebarBackComponent {
  routerActive: string = "activelink";
  search: boolean = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
    user : User = new User;
    name : String = "";
    id : number = 0;
    userId1 : number = 10;
    imageSrcs: (string | ArrayBuffer | null)[] = [];

    ngOnInit(): void {
      this.id = this.storageService.getUser().id ;
      this.storageService.getUserById(this.id).subscribe(
        (user: User) => {
          this.user = user; 
          this.name= this.user.firstname ;
        },
        error => {
          console.error('Error fetching user:', error);
        }
      );
  
    }
  
  constructor(private breakpointObserver: BreakpointObserver,private storageService: StorageService,    private userService: UserService
,
              private authService: AuthService, private router : Router) { }

  sidebarMenu: sidebarMenu[] = [
    {
      link: "/",
      icon: "home",
      menu: "Dashboard",
    },
    {
      link: "/back/leaves",
      icon: "home",
      menu: "Leaves",
    },
  
   
  ]

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
  editUser(userId: number) {
    // Navigate to the Edit User route with the user ID as a parameter
    this.router.navigate(['/back/updateprofile', userId]);
  }
  getImage(filename: string): void {
    console.log("!!!!");
    if (!filename) return; // Skip if filename is not provided
    console.log("!!!!");

    this.userService.getFile(filename).subscribe(
      (response: HttpResponse<Blob>) => {
        if (response && response.body) {
          this.createImageFromBlob(response.body);
          console.log("............")
        } else {
          console.error('Error: Response body is null.');
        }
      },
      error => {
        console.error('Error fetching image:', error);
      }
    );
  }

  createImageFromBlob(image: Blob): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imageSrcs.push(reader.result);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

}
