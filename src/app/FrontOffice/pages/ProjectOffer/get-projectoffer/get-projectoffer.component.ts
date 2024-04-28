import { AddProjectofferComponent } from '../add-projectoffer/add-projectoffer.component';
import { Component } from '@angular/core';
import { ProjectOfferService } from "../../../../Services/project-offer.service";
import { ProjectOffer } from "../../../../Models/project-offer";
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { FilterPipe } from './app-filter.pipe'; // Adjust the import path as necessary
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid'; // if you're using the dayGrid view
import { MatDialog } from '@angular/material/dialog';
import interactionPlugin from '@fullcalendar/interaction';




@Component({
  selector: 'app-get-projectoffer',
  templateUrl: './get-projectoffer.component.html',
  styleUrls: ['./get-projectoffer.component.css'],
  providers: [FilterPipe] // Add the pipe to the providers array


})
export class GetProjectofferComponent {
  projectofferscal: any[] = []; // Change to any[] to hold FullCalendar events

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin], // Include the interactionPlugin here
    dateClick: this.handleDayClick.bind(this), // Ensure this is bound correctly
   };
   
  projectoffers: ProjectOffer[] = [];
  searchText: string = '';

  constructor(private dialog: MatDialog, private po: ProjectOfferService, private router: Router, private appFilterPipe: FilterPipe) {
  }
  handleDayClick(dateInfo: any) {
    const dialogRef = this.dialog.open(AddProjectofferComponent, {
      width: '900px', // Adjust dialog width as needed
      data: { date: dateInfo.dateStr } // Pass clicked date to dialog if needed
    });
    
    // dialogRef.afterClosed().subscribe(result => {
    //   // Handle dialog close if needed
    // });
  }
  
  // updateProjectOffer(projectofferid: number) {
  //   this.router.navigate(['/projectoffer/update-project-offer', projectofferid]);
  // }
  filterProjectOffers(): void {
    if (!this.searchText || this.searchText.trim().length === 0) {
      // If searchText is empty or only contains whitespace, reset projectoffers to its original state
      // Assuming you have a method or property to get the original list of project offers
      this.getallprojectoffer();
    } else {
      // If searchText is not empty, apply the filter
      this.projectoffers = this.appFilterPipe.transform(this.projectoffers, this.searchText);
    }
  }


  getallprojectoffer() {
    this.po.getProjectOffers().subscribe(obsprojectoffers => {
      this.projectoffers = obsprojectoffers;
      this.projectofferscal = obsprojectoffers.map(offer => ({
        title: offer.description, // Use the project offer's description as the event title
        start: offer.postedDate, // Use the project offer's posted date as the event start date
        url: `/projectoffer/update-project-offer/${offer.offerId}`, // Adjust the URL structure as needed
      }));
    });
  }
  handleEventClick(eventInfo: any) {
    if (eventInfo.event.url) {
      window.location.href = eventInfo.event.url;
    }
  }
  
  ngOnInit() {
    this.getallprojectoffer();
  }

  deleteProjectOffer(projectofferid: number) {
    if (confirm('Are you sure you want to delete this job offer?')) {
      this.po.deleteProjectOfferservice(projectofferid).subscribe(
        () => {
          console.log('project offer deleted successfully.');
          alert('project offer deleted successfully.');
          this.getallprojectoffer();
        },
        error => {
          console.error(' project offer id:', projectofferid);

          console.error('Error deleting job offer:', error);
        }
      );
    }
  }

  navigateToAddPROJECTOffer() {
    this.router.navigate(['/projectoffer/update-project-offer']);
  }

}
