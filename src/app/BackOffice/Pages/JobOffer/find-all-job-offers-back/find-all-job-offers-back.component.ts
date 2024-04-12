import {Component, OnInit, ViewChild, AfterViewInit, TemplateRef, ElementRef} from '@angular/core';
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

@Component({
  selector: 'app-find-all-job-offers-back',
  templateUrl: './find-all-job-offers-back.component.html',
  styleUrls: ['./find-all-job-offers-back.component.css']
})
export class FindAllJobOffersBackComponent implements OnInit, AfterViewInit{
  jobOffers: JobOffer[] = [];
  searchtext:any;
  pageSizeOptions: number[] = [4, 8, 16];
  pageSize: number = 16;
  selectedJobOfferDetails?: JobOffer;
  private jobOfferDetailsModalRef: NgbModalRef | undefined;
  @ViewChild('jobOfferDetailsModal', { static: false }) jobOfferDetailsModal!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private js: JobOfferService, private modalService: NgbModal,private candidacyService: CandidacyService,private router: Router){}
  loadJobOffers() {
    this.js.findAllJobOffers().subscribe(jobOffers => {
      this.jobOffers = jobOffers;
    });
  }
  ngOnInit() {
    this.loadJobOffers();
    this.selectedJobOfferDetails = undefined; // Set selectedJobOfferDetails to undefined initially
  }
  ngAfterViewInit() {
    // Set the paginator after the view initialization
    this.paginator.pageSize = this.pageSize;
    this.paginator.pageSizeOptions = this.pageSizeOptions;
  }


  onPageChange(event: any) {
    this.pageSize = event.pageSize;
  }
  openJobOfferDetailsModal(jobId: number) {
    this.js.getJobOfferById(jobId).subscribe(
      jobOffer => {
        this.selectedJobOfferDetails = jobOffer;
        this.jobOfferDetailsModalRef = this.modalService.open(this.jobOfferDetailsModal, { centered: true });
      },
      error => {
        console.error('Error fetching job offer:', error);
        // Handle error, e.g., display an error message
      }
    );
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
    this.router.navigate(['/statisticsHR']);
  }
}
