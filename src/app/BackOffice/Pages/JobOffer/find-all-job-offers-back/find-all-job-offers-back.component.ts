import {Component, OnInit, ViewChild, AfterViewInit, TemplateRef, ElementRef} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { JobOffer } from 'src/app/Models/job-offer';
import { JobCategory } from 'src/app/Models/job-category';
import { JobNature } from 'src/app/Models/job-nature';
import { JobOfferService } from 'src/app/Services/job-offer.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-find-all-job-offers-back',
  templateUrl: './find-all-job-offers-back.component.html',
  styleUrls: ['./find-all-job-offers-back.component.css']
})
export class FindAllJobOffersBackComponent implements OnInit, AfterViewInit{
  jobOffers: JobOffer[] = [];
  displayedColumns: string[] = [ 'titleJobOffer', 'postedDate', 'applicationDeadLine',  'vacancy'];
  pageSizeOptions: number[] = [4, 8, 16];
  pageSize: number = 16;
  selectedJobOfferDetails?: JobOffer;
  private jobOfferDetailsModalRef: NgbModalRef | undefined;
  @ViewChild('jobOfferDetailsModal', { static: false }) jobOfferDetailsModal!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private js: JobOfferService, private modalService: NgbModal){}
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
  getColumnHeader(column: string): string {
    // You can customize column headers here if needed
    return column;
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
}
