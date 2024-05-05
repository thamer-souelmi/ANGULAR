import { Component } from '@angular/core';
import {Observable} from "rxjs";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import {StorageService} from "../../Services/storage.service";
import {AuthService} from "../../Services/auth.service";
import {Router} from "@angular/router";
import { User } from 'src/app/Models/User';
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

  constructor(private breakpointObserver: BreakpointObserver,private storageService: StorageService,
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
  //link

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
}
