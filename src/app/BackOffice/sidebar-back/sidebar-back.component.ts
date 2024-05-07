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
      const roles = this.storageService.getUser().roles;
      const isAdminHR = this.isAdminHR();
      const isAdminCRM = this.isAdminCRM();
      console.log('Is Employee HR:', isAdminHR);
      console.log('User ID:', this.storageService.getUser().id);
      if (!isAdminCRM) {
        this.sidebarMenu = [
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
        ];
      }
      // Adjust the sidebar menu based on the user's role
      if (!isAdminHR) {
        this.sidebarMenu = [
          {
            link: "/",
            icon: "home",
            menu: "Dashboard",
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
          },{
            link:"/back/activityB",
            icon:"home",
             menu:"Activity",
           },
           {
             link:"/back/EventBack",
             icon:"cap",
             menu:"Event",
           },
           {
             link:"/back/trainingSessionB",
             icon:"home",
             menu:"Training Session",
           },
          
        ];
      }
    }
    isAdminHR(): boolean {
      const roles = this.storageService.getUser()?.roles;
      return roles && roles.includes('adminHR');
    }
    isAdminCRM(): boolean {
      const roles = this.storageService.getUser()?.roles;
      return roles && roles.includes('adminCRM');
    }
    isAdminProject(): boolean {
      const roles = this.storageService.getUser()?.roles;
      return roles && roles.includes('adminProject');
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
     icon:"home",
      menu:"Activity",
    },
    {
      link:"/back/EventBack",
      icon:"cap",
      menu:"Event",
    },
    {
      link:"/back/trainingSessionB",
      icon:"home",
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
      link: "/Projectback/testt",
      icon: "slack",
      menu: "Projects",
    },
    {
      link: "/Projectback/kanbanback",
      icon: "list",
      menu: "Kanban Board",
    },
    {
      link: "/Projectback/gantt",
      icon: "layers",
      menu: "Gantt",
    },
    {
      link: "/Projectback/Todolist",
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
  this.router.navigate(['/back/updateuser', userId]);
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
