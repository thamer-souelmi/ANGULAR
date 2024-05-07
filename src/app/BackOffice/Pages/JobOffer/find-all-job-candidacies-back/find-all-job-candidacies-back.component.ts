import {Component, OnInit} from '@angular/core';
import {Candidacy} from "../../../../Models/candidacy";
import {CandidacyService} from "../../../../Services/candidacy.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import dayGridPlugin from "@fullcalendar/daygrid";
import {MatDialog} from "@angular/material/dialog";

import {
  CandidateLinkedInDetailsBackComponent
} from "../candidate-linked-in-details-back/candidate-linked-in-details-back.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-find-all-job-candidacies-back',
  templateUrl: './find-all-job-candidacies-back.component.html',
  styleUrls: ['./find-all-job-candidacies-back.component.css']
})
export class FindAllJobCandidaciesBackComponent implements OnInit{
  selectedCandidacy: Candidacy | null = null; // Variable to store selected candidacy
  jobOfferId: number = 0;
  candidacies: Candidacy[] = [];
  searchtext:any;
  currentPage: number = 1; // Current page
  itemsPerPage: number = 6; // Items per page

  ngOnInit(): void {
    // No need to subscribe to route params here, as it's already done in the constructor
    this.loadCandidacies(this.jobOfferId);
  }
  constructor(private c: CandidacyService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService,public dialog: MatDialog) {

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
  navigateToStatistics() {
    this.router.navigate(['/back/statisticsCandidacies']);
  }
  openDetailModal(candidate: Candidacy) {
    const dialogRef = this.dialog.open(CandidateLinkedInDetailsBackComponent, {
      data: { candidate: candidate }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle modal close event if needed
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
}
