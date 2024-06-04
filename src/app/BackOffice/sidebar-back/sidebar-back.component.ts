
import { Component,OnInit } from '@angular/core';
import {Observable, Subscription} from "rxjs";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import {StorageService} from "../../Services/storage.service";
import {AuthService} from "../../Services/auth.service";
import {Router} from "@angular/router";
import { User } from 'src/app/Models/User';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { AttendanceService } from 'src/app/Services/attendance.service';
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
export class SidebarBackComponent implements OnInit{
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
    const roles = this.storageService.getUser().roles;

    console.log('User ID:', this.storageService.getUser().id);

    // Adjust the sidebar menu based on the user's role

  }


  
  constructor(private breakpointObserver: BreakpointObserver,
              private storageService: StorageService,
              private authService: AuthService,
              private router : Router,
              private localStorageService:LocalStorageService,
              private attendanceService:AttendanceService) { }

  sidebarMenu: sidebarMenu[] = [
    {
      link: "/",
      icon: "home",
      menu: "Dashboard",
    },
    {
      link: "/back/findall",
      icon: "home",
      menu: "USERS",
    },
    {
      link: "/back/leaves",
      icon: "home",
      menu: "leaves",
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
      link:"/back/activityB",
      icon:"slack",
      menu:"Activity",
    },
    {
      link:"/back/room",
      icon:"home",
      menu:"Rooms",
    },
    {
      link:"/back/EventBack",
      icon:"slack",
      menu:"Event",
    },
    {
      link:"/back/trainingSessionB",
      icon:"award",
      menu:"Training Session",
    },
    {
      link: "/back/findAllJobOffersback",
      icon: "slack",
      menu: "HR",
    },
    {
      link: "/back/findQuiz",
      icon: "award",
      menu: "Quiz",
    },
    {
      link: "/back/contractEmployment",
      icon: "file-text",
      menu: "Contracts",
    },
    {
      link: "/back/testt",

      icon: "slack",
      menu: "Projects",
    },
    {
      link: "/back/kanbanback",

      icon: "list",
      menu: "Kanban Board",
    },
    {
      link: "/back/gantt",

      icon: "layers",
      menu: "Gantt",
    },
    {
      link: "/back/Todolist",
      icon: "layout",
      menu: "To Do List",
    },
    //link


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
  editUser(userId: number) {
    // Navigate to the Edit User route with the user ID as a parameter
    this.router.navigate(['/back/updateprofile', userId]);
  }
  chat() {
    // Navigate to the Edit User route with the user ID as a parameter
    this.router.navigate(['/back/chat']);
  }
}
