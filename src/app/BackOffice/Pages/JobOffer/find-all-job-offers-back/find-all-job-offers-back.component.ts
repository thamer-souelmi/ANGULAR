import {Component, OnInit, ViewChild, AfterViewInit, TemplateRef, ElementRef, ChangeDetectorRef} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { JobOffer } from 'src/app/Models/job-offer';
import { JobCategory } from 'src/app/Models/job-category';
import { JobNature } from 'src/app/Models/job-nature';
import { JobOfferService } from 'src/app/Services/job-offer.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {forkJoin, Observable} from "rxjs";
import {CandidacyService} from "../../../../Services/candidacy.service";
import {ActivatedRoute} from "@angular/router";
import { Router } from '@angular/router';
import {MatDialog} from "@angular/material/dialog";

import {JobOfferDetailsBackComponent} from "../job-offer-details-back/job-offer-details-back.component";

@Component({
  selector: 'app-find-all-job-offers-back',
  templateUrl: './find-all-job-offers-back.component.html',
  styleUrls: ['./find-all-job-offers-back.component.css']
})
export class FindAllJobOffersBackComponent implements OnInit, AfterViewInit{
  jobOffers: JobOffer[] = [];
  searchtext:any;
  currentPage: number = 1; // Current page
  itemsPerPage: number = 6; // Items per page
  selectedJobOfferDetails: JobOffer | null = null;
  private jobOfferDetailsModalRef: NgbModalRef | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('detailsModal') detailsModal!: TemplateRef<any>;
  isDetailsModalOpen: boolean = false;
  isModalOpen: boolean = false;
  isResultsModalOpen = false;
  constructor(private js: JobOfferService, private modalService: NgbModal,private candidacyService: CandidacyService,private router: Router,    private cdr: ChangeDetectorRef,public dialog: MatDialog
  ){}
  loadJobOffers() {
    this.js.findAllJobOffers().subscribe(jobOffers => {
      this.jobOffers = jobOffers;
    });
  }
  ngOnInit() {
    this.loadJobOffers();
    this.isResultsModalOpen = false;// Set selectedJobOfferDetails to undefined initially
  }

  ngAfterViewInit() {

  }

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  getPaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.jobOffers.slice(startIndex, startIndex + this.itemsPerPage);
  }
  getTotalPages(): number {
    return Math.ceil(this.jobOffers.length / this.itemsPerPage);
  }
  getPaginationNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pagesArray = [];
    for (let i = 1; i <= totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }


  closeModal() {
    if (this.jobOfferDetailsModalRef) {
      this.jobOfferDetailsModalRef.close();
    }
  }
  sortByMostRecent() {
    // Sort the jobOffers array by descending postedDate
    this.jobOffers.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }
  sortByMostApplied(): void {
    console.log('Sorting by most applied...');

    // Create an array to hold all observables for counting candidacies
    const observables: Observable<number>[] = [];

    // Iterate through jobOffers to create an array of observables
    this.jobOffers.forEach(jobOffer => {
      observables.push(this.countCandidacies(jobOffer));
    });

    // Use forkJoin to wait for all observables to complete
    forkJoin(observables).subscribe(counts => {
      // Assign the candidacy counts to job offers
      counts.forEach((count, index) => {
        this.jobOffers[index].candidacyCount = count;
      });

      // Sort job offers based on the count of candidacies
      this.jobOffers = this.jobOffers.sort((a, b) => {
        // Handle possible undefined values of candidacyCount
        const countA = a.candidacyCount ?? 0; // Use 0 if candidacyCount is undefined
        const countB = b.candidacyCount ?? 0; // Use 0 if candidacyCount is undefined
        return countB - countA; // Sort in descending order
      });

      console.log('Sorted job offers by most applied:', this.jobOffers);
    });
  }
  countCandidacies(jobOffer: JobOffer): Observable<number> {
    return this.candidacyService.countCandidaciesByJobOfferId(jobOffer.jobOffer_id);
  }
  navigateToStatistics() {
    this.router.navigate(['/back/statisticsHR']);
  }
  // openDetailsModal(activity: JobOffer): void {
  //   console.log('Selected Job Offer ID:', activity.jobOffer_id); // Log the ID of the selected job offer
  //   this.selectedJobOfferDetails = activity;
  //   console.log('Selected Job Offer Details:', this.selectedJobOfferDetails); // Log the selectedJobOfferDetails
  //   this.isDetailsModalOpen = true;
  //   this.cdr.detectChanges(); // Trigger change detection manually
  // }
  //
  //
  // closeDetailsModal(): void {
  //   this.selectedJobOfferDetails = null;
  //   this.isDetailsModalOpen = false; // Set the modal to close
  // }
  openDetailModal(jobOffer: JobOffer) {
    const dialogRef = this.dialog.open(JobOfferDetailsBackComponent, {
      data: { jobOffer: jobOffer }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle modal close event if needed
    });
  }

}
