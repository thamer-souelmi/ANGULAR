import { Component } from '@angular/core';
import {Observable, Subscription} from "rxjs";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import {StorageService} from "../../Services/storage.service";
import {AuthService} from "../../Services/auth.service";
import {Router} from "@angular/router";
import { User } from 'src/app/Models/User';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { AttendanceService } from 'src/app/Services/attendance.service';
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
    ngOnInit(): void {
      this.name= this.storageService.getUserS.name;
      console.log("Name in sidebar "+this.name);

    }
  constructor(private attendanceService: AttendanceService,private localStorageService: LocalStorageService,private breakpointObserver: BreakpointObserver,private storageService: StorageService,
              private authService: AuthService, private router : Router) { }

  sidebarMenu: sidebarMenu[] = [
    {
      link: "/",
      icon: "home",
      menu: "Dashboard",
    },
    {
      link: "/back/dataflow",
      icon: "disc",
      menu: "Data Flow",
    },
    {
      link: "/back/projectofferflow",
      icon: "layout",
      menu: "Project Offer Flow",
    },
    {
      link: "/back/inactiveprojectoffer",
      icon: "info",
      menu: "Inactive P.O",
    },
    {
      link: "/back/screenshots",
      icon: "eye",
      menu: "Activity Tracking",
    },
    {
      link: "/back/atte",
      icon: "clock",
      menu: "Attendance",
    },
    {
      link: "/grid-list",
      icon: "file-text",
      menu: "Grid List",
    },
    {
      link: "/menu",
      icon: "menu",
      menu: "Menus",
    },
    {
      link: "/table",
      icon: "grid",
      menu: "Tables",
    },
    {
      link: "/expansion",
      icon: "divide-circle",
      menu: "Expansion Panel",
    },
    {
      link: "/chips",
      icon: "award",
      menu: "Chips",
    },
    {
      link: "/tabs",
      icon: "list",
      menu: "Tabs",
    },
    {
      link: "/progress",
      icon: "bar-chart-2",
      menu: "Progress Bar",
    },
    {
      link: "/toolbar",
      icon: "voicemail",
      menu: "Toolbar",
    },
    {
      link: "/progress-snipper",
      icon: "loader",
      menu: "Progress Snipper",
    },
    {
      link: "/tooltip",
      icon: "bell",
      menu: "Tooltip",
    },
    {
      link: "/snackbar",
      icon: "slack",
      menu: "Snackbar",
    },
    {
      link: "/slider",
      icon: "sliders",
      menu: "Slider",
    },
    {
      link: "/slide-toggle",
      icon: "layers",
      menu: "Slide Toggle",
    },
  ]

  logout(): void {
    this.removeAttendance();
    this.localStorageService.removeItem('attendanceId');

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

  removeAttendance(): void {
    // Arrêter l'attendance uniquement si l'ID de l'attendance est présent dans le local storage
    const attendanceIdend = this.localStorageService.getItem('attendanceId');
    if (attendanceIdend) {
      this.attendanceService.deleteAttendance(attendanceIdend-1).subscribe(
        () => {
          console.log('Attendance deleted successfully.');
        },
        (error) => {
          console.error('Failed to delete attendance:', error);
        }
      );
    }
}
}
