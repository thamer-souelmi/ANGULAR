import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Candidacy } from 'src/app/Models/candidacy';
import { CandidacyService } from 'src/app/Services/candidacy.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
declare var createGoogleEvent: any;
import * as bootstrap from 'bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {FullCalendarComponent} from "@fullcalendar/angular";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";

@Component({
  selector: 'app-find-all-job-candidacies',
  templateUrl: './find-all-job-candidacies.component.html',
  styleUrls: ['./find-all-job-candidacies.component.css']
})
export class FindAllJobCandidaciesComponent implements OnInit{
  candidacystatus: number = 0;
  @ViewChild('myModal') myModal!: ElementRef;
  selectedCandidacy: Candidacy | null = null; // Variable to store selected candidacy
  calendarPlugins = [dayGridPlugin];
  calendarEvents: any[] = [];
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  calendarOptions: any = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    dateClick: this.handleDateClick.bind(this),
  };
  modalBodyContent: string = '';
  jobOfferId: number = 0;

  candidacies: Candidacy[] = [];
  appointmentForm!: FormGroup;

  constructor(private c: CandidacyService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) {
    this.appointmentForm = this.fb.group({
      appointmentTime: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    // Retrieve jobOfferId from the route parameters
    this.route.params.subscribe(params => {
      this.jobOfferId = +params['id']; // Retrieve jobOfferId from route params
      console.log('Received Job Offer ID:', this.jobOfferId);
      if (isNaN(this.jobOfferId) || this.jobOfferId <= 0) {
        console.log('Invalid Job Offer ID:', this.jobOfferId);
      } else {
        // Load the candidacies related to the job offer ID
        this.loadCandidacies(this.jobOfferId);
      }
    });

  }

  openAppointmentModal(candidacy: Candidacy) {
    this.selectedCandidacy = candidacy; // Store the selected candidacy
    const myModal = new bootstrap.Modal(this.myModal.nativeElement);
    myModal.show();
  }

  // Function to conduct interview
  conductInterview(candidacy: Candidacy) {
    // Your logic to conduct the interview here...
    console.log('Conducting interview for:', candidacy);
  }



  scheduleMeeting() {
    let appointmentTime = new Date(this.appointmentForm.value.appointmentTime);
    const startTime = appointmentTime.toISOString().slice(0, 18) + '-07:00';
    const endTime = this.getEndTime(appointmentTime);
    const eventDetails = {
      email: this.appointmentForm.value.email,
      startTime: startTime,
      endTime: endTime,
    };
    console.info(eventDetails);
    createGoogleEvent(eventDetails);
  }

  getEndTime(appointmentTime: Date) {
    appointmentTime.setHours(appointmentTime.getHours() + 1);
    const endTime = appointmentTime.toISOString().slice(0, 18) + '-07:00';
    return endTime;
  }


  ngOnInit(): void {
    // No need to subscribe to route params here, as it's already done in the constructor
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
    };
  }

  loadCandidacies(jobOfferId: number) {
    console.log('Loading candidacies for Job Offer ID:', jobOfferId);
    this.c.getAllCandidaciesByJobOfferId(jobOfferId)
      .subscribe(candidacies => {
        this.candidacies = candidacies;
      }, error => {
        console.error('Error fetching candidacies:', error);
        // Handle error appropriately, e.g., show error message to user
      });
  }
  downloadAttachment(event: Event, cv: string) {
    event.preventDefault(); // Prevent the default behavior of the anchor tag

    // Make a request to download the file
    this.c.getFiles().subscribe(response => {
      // Create a blob from the response
      const blob = new Blob([response], { type: 'application/octet-stream' });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create an anchor element and set its attributes
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = cv.substring(cv.lastIndexOf('/') + 1);

      // Simulate a click on the anchor element to trigger the download
      anchor.click();

      // Release the URL object to free up resources
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error downloading attachment:', error);
      // Handle error appropriately, e.g., show error message to user
    });
  }
  updateCandidacyStatus(candidacy: Candidacy, status: number) {
    candidacy.candidacystatus = status; // Update the candidacy status locally

    // Call the service method to update the candidacy status in the database
    this.c.updateCandidacyStatus(candidacy).subscribe(updatedCandidacy => {
      console.log('Candidacy status updated successfully:', updatedCandidacy);

      // Display toastr notification based on the candidacy status
      if (status === -1) {
        this.toastr.error('Candidate Rejected !', 'Oops');
      } else if (status === 2) {
        this.toastr.success('Candidate Hired !', 'Success');
      }

      // Optionally, you can update the local candidacies array or handle other UI updates
    }, error => {
      console.error('Error updating candidacy status:', error);
      // Handle error appropriately, e.g., show error message to user
    });
  }
  handleDateClick(arg: any): void {
    // arg.dateStr contient la date sélectionnée
    console.log('date click! ', arg.dateStr);
    // Ici, vous pouvez ouvrir une modal affichant les événements de cette date
  }

}
