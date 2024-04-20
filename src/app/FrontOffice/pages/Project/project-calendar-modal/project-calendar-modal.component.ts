import { Component, OnInit  } from '@angular/core';
import { CalendarEvent, CalendarView,DateAdapter  } from 'angular-calendar';
import { ProjectService } from 'src/app/Services/project.service';
import { Project } from 'src/app/Models/project';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { EventColor } from 'calendar-utils';
import { ProjectDetailsComponent } from '../project-details/project-details.component';
import { MatDialog } from '@angular/material/dialog';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};


@Component({
  selector: 'app-project-calendar-modal',
  templateUrl: './project-calendar-modal.component.html',
  styleUrls: ['./project-calendar-modal.component.css'],
  providers: [
    { provide: DateAdapter, useFactory: adapterFactory } 
  ]
})
export class ProjectCalendarModalComponent implements OnInit {
  
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent<{ project: Project }>[] = []; 
  activeDayIsOpen: boolean = true;
  constructor(private projectService: ProjectService, private dialog: MatDialog) {
   
  }
  ngOnInit() {
    this.projectService.getAllProjects().subscribe((projects: Project[]) => {
      this.events = projects.map((project: Project) => ({
        start: new Date(project.startdateProject),
        title: project.projectName,
        color:  colors['blue'],
        meta: {
          project: project
        }
      }));
    });
  }
  eventClicked(event: CalendarEvent<{ project: Project }>): void {
    if (event.meta) {
      this.openProjectDetailsModal(event.meta.project);
      console.log("Project name:", event.meta.project.projectName);
      console.log("End date:", event.meta.project.enddateProject);
    }
  }
  openProjectDetailsModal(project: Project): void {
    const dialogRef = this.dialog.open(ProjectDetailsComponent, {
      width: '600px',
      data: { project: project }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Vous pouvez ajouter des actions supplémentaires après la fermeture du modal si nécessaire
    });
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    
      if (
        ( this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    
  }
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  setView(view: CalendarView) {
    this.view = view;
  }
 
}
