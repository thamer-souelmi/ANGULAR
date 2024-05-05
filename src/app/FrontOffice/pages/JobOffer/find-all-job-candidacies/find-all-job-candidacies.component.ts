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
import { HttpClient } from '@angular/common/http';
import {RecommendationService} from "../../../../Services/recommendation.service";
import {MatDialog} from "@angular/material/dialog";
import {InterviewCalendarComponent} from "../../Interview/interview-calendar/interview-calendar.component";
import {
  CandiadateLinkedInDetailsComponent
} from "../candiadate-linked-in-details/candiadate-linked-in-details.component";
import {AddInterviewComponent} from "../../Interview/add-interview/add-interview.component";
import {DatePipe} from "@angular/common";
import {
  AddQuizQuestionComponent
} from "../../../../BackOffice/Pages/Quiz/add-quiz-question/add-quiz-question.component";
import {AddMarkComponent} from "../add-mark/add-mark.component";
import {StorageService} from "../../../../Services/storage.service";
import {JobOfferService} from "../../../../Services/job-offer.service";

@Component({
  selector: 'app-find-all-job-candidacies',
  templateUrl: './find-all-job-candidacies.component.html',
  styleUrls: ['./find-all-job-candidacies.component.css'],
  providers: [DatePipe]
})
export class FindAllJobCandidaciesComponent implements OnInit{
  userId!: number;
  searchtext:any;
  recommendationResponse: string = ''; // Variable to store recommendation response
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
  jobId: number = 0;
  public id!: string | null;
  candidacies: Candidacy[] = [];
  appointmentForm!: FormGroup;
  currentPage: number = 1; // Current page
  itemsPerPage: number = 6; // Items per page
  jobOfferVacancy: number = 0;
  constructor(private c: CandidacyService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private toastr: ToastrService,private http: HttpClient,private recommendationService: RecommendationService,public dialog: MatDialog,private s:StorageService,private jobOfferService: JobOfferService) {
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
        this.jobOfferVacancy = +params['vacancy'];

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
    this.route.params.subscribe(params => {
      this.jobOfferId = +params['id']; // Retrieve job offer ID from route params
      // Call your service method to fetch job offer details by ID
      this.jobOfferService.getJobOfferById(this.jobOfferId).subscribe(
        (jobOffer: any) => {
          this.loadCandidacies(this.jobOfferId);
          this.jobOfferVacancy = jobOffer.vacancy; // Assign job offer vacancy to jobOfferVacancy
          console.log('Job Offer Vacancy:', this.jobOfferVacancy);
          // Now you have the correct vacancy related to the job offer ID
          // You can proceed to use this value wherever needed, such as in sending requirements to your Python script
        },
        (error: any) => {
          console.error('Error fetching job offer details:', error);
          // Handle error appropriately
        }
      );
    });

  }

  loadCandidacies(jobOfferId: number) {
    console.log('Loading candidacies for Job Offer ID:', jobOfferId);
    this.c.getAllCandidaciesByJobOfferId(jobOfferId)
      .subscribe(candidacies => {
// Assuming `candidacies` is an array of Candidacy objects
        this.candidacies = candidacies.filter(candidacy => !candidacy.archived);
        console.log( "hiiiii",this.candidacies)
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
    const id =this.s.getUser().id;
    console.log(id)
    // Call the service method to update the candidacy status in the database
    this.c.updateCandidacyStatus(candidacy,id).subscribe(updatedCandidacy => {
      console.log('Candidacy status updated successfully:', updatedCandidacy);
      console.log(candidacy)
      // Display toastr notification based on the candidacy status
      if (status === -1) {
        this.toastr.error('Candidate Rejected !', 'Oops');
        // window.location.reload();
        this.loadCandidacies(this.jobOfferId);
      } else if (status === 2) {
        this.toastr.success('Candidate Hired !', 'Success');

      }
      else if (status === 1) {
        this.toastr.info('Candidate Selected for Interview !', 'Success');
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


  sendRequirements() {
    const requirements = {
      html: 5,
      python: 4,
      java: 3,
      c: 2,
      javascript: 4,
      kotlin: 2,
      swift: 1,
      react: 3,
      angular: 2,
      spring: 4,
      candidate: this.jobOfferVacancy
    };

    // this.c.sendRequirements(requirements).subscribe(
    //   (response) => {
    //     console.log('Response from server:', response);
    //     // Handle the response from the server as needed
    //   },
    //   (error) => {
    //     console.error('Error sending requirements:', error);
    //     // Handle errors
    //   }
    // );
    this.c.sendRequirements(requirements).subscribe(
      (response) => {
        console.log('Response from server:', response);
        // Format the response array
        const formattedResponse = response.map((item: any, index: number) => `${index + 1}.${item[1]}:${item[0]}`);
        // Join the formatted response array into a single string with line breaks
        const formattedResponseString = formattedResponse.join('\n');
        // Store the formatted response in recommendationResponse variable
        this.recommendationResponse = formattedResponseString;
        // Open the response modal
        const responseModal = new bootstrap.Modal(document.getElementById('responseModal')!);
        responseModal.show();
      },
      (error) => {
        console.error('Error sending requirements:', error);
        // Handle errors
      }
    );
  }
  openCalendarModal() {
    const dialogRef = this.dialog.open(InterviewCalendarComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openDetailModal(candidate: Candidacy) {
    const dialogRef = this.dialog.open(CandiadateLinkedInDetailsComponent, {
      data: { candidate: candidate }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle modal close event if needed
    });
  }
  addInterviewModal() {
    const dialogRef = this.dialog.open(AddInterviewComponent, {
      width: '500px',
      data: { /* any data you want to pass to the modal */ }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Logic to handle modal close event if needed
    });
  }
  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  getPaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.candidacies.slice(startIndex, startIndex + this.itemsPerPage);
  }
  getTotalPages(): number {
    return Math.ceil(this.candidacies.length / this.itemsPerPage);
  }
  getPaginationNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pagesArray = [];
    for (let i = 1; i <= totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  openAddMarkDialog() {
    const dialogRef = this.dialog.open(AddMarkComponent, {
      width: '600px',
      data: { /* any data you want to pass to the modal */ }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Logic to handle modal close event if needed
    });
  }


}
