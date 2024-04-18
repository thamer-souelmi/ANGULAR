import { Component, OnInit  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarEvent, CalendarView,DateAdapter  } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { InterviewService } from 'src/app/Services/interview.service';
import { Interview } from 'src/app/Models/interview';
import {InterviewDetailsComponent} from "../interview-details/interview-details.component";

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
  selector: 'app-interview-calendar',
  templateUrl: './interview-calendar.component.html',
  styleUrls: ['./interview-calendar.component.css']
})
export class InterviewCalendarComponent implements OnInit{
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent<{ interview: Interview }>[] = [];
  activeDayIsOpen: boolean = true;
  constructor(private i: InterviewService, private dialog: MatDialog) {

  }
  ngOnInit() {
    this.i.findAllInterviewsWithCandidateNamesAndEmail().subscribe((interviews: Interview[]) => {
      this.events = interviews.map((interview: Interview) => ({
        start: new Date(interview.dateInterview),
        title: interview.candidateName,
        color:  colors['blue'],
        meta: {
          interview: interview
        }
      }));
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

  eventClicked(event: CalendarEvent<{ interview: Interview }>): void {
    if (event.meta) {
      this.openProjectDetailsModal(event.meta.interview);
      console.log("Result Interview:", event.meta.interview.passed);
      console.log("Interview date:", event.meta.interview.dateInterview);
    }
  }
  openProjectDetailsModal(interview: Interview): void {
    const dialogRef = this.dialog.open(InterviewDetailsComponent, {
      width: '600px',
      data: { interview: interview }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Vous pouvez ajouter des actions supplémentaires après la fermeture du modal si nécessaire
    });
  }
}
