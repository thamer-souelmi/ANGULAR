import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, NgZone, AfterViewInit } from '@angular/core';
import { JobOffer } from 'src/app/Models/job-offer';
import { JobCategory } from 'src/app/Models/job-category';
import { JobNature } from 'src/app/Models/job-nature';
import { WishlistComponent } from 'src/app/FrontOffice/pages/JobOffer/wishlist/wishlist.component';
import { JobOfferService } from 'src/app/Services/job-offer.service';
import { CandidacyService } from 'src/app/Services/candidacy.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import * as bootstrap from 'bootstrap';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { DatePipe } from '@angular/common';
import {Candidacy} from "../../../../Models/candidacy";
import {Observable} from "rxjs"; // Import the pipe
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-find-all-job-offers',
  templateUrl: './find-all-job-offers.component.html',
  styleUrls: ['./find-all-job-offers.component.css'],
  providers: [DatePipe]
})
export class FindAllJobOffersComponent implements OnInit, AfterViewInit {
  @ViewChild('locationSelect') locationSelect: ElementRef | undefined;
  searchtext:any;
  filteredJobOffers: JobOffer[] = [];
  jobOffers: JobOffer[] = [];
  jobOffer: JobOffer = new JobOffer();
  currentPage: number = 1; // Current page
  itemsPerPage: number = 4; // Items per page
  wishlist: JobOffer[] = [];
  jobOfferForm: FormGroup;
  @ViewChild('myModal') myModal!: ElementRef;
  @ViewChild('warningSuccessModal') warningSuccessModal!: ElementRef;
  warningMessage: string = '';
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal!: ElementRef;
  private jobOfferIdToDelete!: number;
  updateJobOfferForm!: FormGroup;
  @ViewChild('updateJobOfferModal') updateJobOfferModal!: ElementRef;
  selectedJobOffer?: JobOffer ;
  jobOffersLocations: string[] = [];
  jobOffersVacancies: number[] = [];
  jobOffersCategories: string[] = [];
  jobOffersJobTypes: string[] = [];

  selectedLocation: string = '';
  selectedVacancy: number = 0;
  selectedCategory: string = '';
  selectedJobType: string = '';

  jobOffer_id!: number;
  jobOffer1!: JobOffer;
  private candidacies!: Candidacy[];
  constructor(private js: JobOfferService, private router: Router,private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
              private ngZone: NgZone,private route: ActivatedRoute,private candidacyService: CandidacyService) {
    this.jobOfferForm = this.formBuilder.group({
      titleJobOffer: ['', Validators.required],
      description: ['', Validators.required],
      requiredSkills: ['', Validators.required],
      experience: ['', Validators.required],
      jobLocation: ['', Validators.required],
      applicationDeadLine: ['', Validators.required],
      vacancy: [Validators.required, Validators.min(1)],
      minsalary: [Validators.required, Validators.min(1)],
      maxsalary: [Validators.required, Validators.min(1)],
      jobNature: [0, Validators.required],
      jobCategory: [0, Validators.required]
    }, { validators: this.salaryRangeValidator });
    this.updateJobOfferForm = this.formBuilder.group({
      jobOffer_id: [''], // Ensure this field is included
      titleJobOffer: ['', Validators.required],
      description: ['', Validators.required],
      requiredSkills: ['', Validators.required],
      experience: ['', Validators.required],
      jobLocation: ['', Validators.required],
      // applicationDeadLine: ['', Validators.required],
      vacancy: ['', [Validators.required, Validators.min(1)]],
      minsalary: ['', [Validators.required, Validators.min(1)]],
      maxsalary: ['', [Validators.required, Validators.min(1)]],
      // jobNature: ['', Validators.required],
      // jobCategory: ['', Validators.required],
    }, { validators: this.salaryRangeValidator });

  }
  ngAfterViewInit() {
    // Access the nativeElement property inside ngAfterViewInit
    if (this.locationSelect) {
      this.locationSelect.nativeElement.value = 'Location';
    }
    // Repeat for other select elements if needed
  }

  loadJobOffers() {
    this.js.findAllJobOffers().subscribe(jobOffers => {
      this.jobOffers = jobOffers;
      this.filteredJobOffers = [...this.jobOffers];
      // Extract unique values for each field
      this.jobOffersLocations = Array.from(new Set(jobOffers.map(jobOffer => jobOffer.jobLocation)));
      this.jobOffersVacancies = Array.from(new Set(jobOffers.map(jobOffer => jobOffer.vacancy)));
      // Convert enum values to strings before assigning
      this.jobOffersCategories = Array.from(new Set(jobOffers.map(jobOffer => JobCategory[jobOffer.jobCategory])));
      this.jobOffersJobTypes = Array.from(new Set(jobOffers.map(jobOffer => JobNature[jobOffer.jobNature])));
    });
    this.sortByMostApplied();
  }
  onJobOfferSubmit() {
    if (this.jobOfferForm.valid) {
      const jobOffer: JobOffer = this.jobOfferForm.value;

      // Call the job offer service to add the job offer
      this.js.addJobOffer(jobOffer).subscribe(
        (addedJobOffer: JobOffer) => {
          console.log('Job offer added successfully:', addedJobOffer);
          // Show success message
          this.showModalWithMessage('Job offer added successfully!');
          // Reset the form
          this.jobOfferForm.reset();
          // Reload job offers
          this.loadJobOffers();
        },
        error => {
          console.error('Error adding job offer:', error);
          // Show error message
          this.showModalWithMessage('Error adding job offer. Please try again.');
        }
      );
    }
  }

  showModalWithMessage(message: string): void {
    this.warningMessage = message;
    const modalInstance = new bootstrap.Modal(this.warningSuccessModal.nativeElement);
    modalInstance.show();
  }

  ngOnInit() {
    this.loadJobOffers();
    this.loadWishlist();

  }


  addToWishlist(jobOffer: JobOffer) {
    if (!this.isInWishlist(jobOffer)) {
      this.wishlist.push(jobOffer);
      this.saveWishlist();
    }
  }

  isInWishlist(jobOffer: JobOffer): boolean {
    return this.wishlist.some(item => item.jobOffer_id === jobOffer.jobOffer_id);
  }

  saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }

  loadWishlist() {
    const storedWishlist = localStorage.getItem('wishlist');
    this.wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
  }


  navigateToWishlist() {
    // Navigate to the WishlistComponent or any route you have for the wishlist
    this.router.navigate(['/JobOffer/wishlist']);
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
  askDeleteConfirmation(jobOfferId: number): void {
    this.jobOfferIdToDelete = jobOfferId;
    const modal = new bootstrap.Modal(this.deleteConfirmationModal.nativeElement);
    modal.show();
  }

  confirmDeletion(): void {
    this.js.deleteJobOffer(this.jobOfferIdToDelete).subscribe({
      next: () => {
        this.showModalWithMessage('Job offer deleted successfully!');
        this.loadJobOffers(); // Refresh the job offers list
      },
      error: () => {
        this.showModalWithMessage('Error deleting the job offer. Please try again.');
      }
    });

    // Correct way to hide the modal
    const modalInstance = bootstrap.Modal.getInstance(this.deleteConfirmationModal.nativeElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }


  showUpdateModal(jobOffer: JobOffer): void {
    // Assign the selected job offer to the component variable
    this.selectedJobOffer = jobOffer;

    // Check if the selected job offer is defined
    if (this.selectedJobOffer) {
      // Populate the form fields with the data of the selected job offer
      this.updateJobOfferForm.patchValue({
        jobOffer_id: this.selectedJobOffer.jobOffer_id,
        titleJobOffer: this.selectedJobOffer.titleJobOffer,
        description: this.selectedJobOffer.description,
        requiredSkills: this.selectedJobOffer.requiredSkills,
        experience: this.selectedJobOffer.experience,
        jobLocation: this.selectedJobOffer.jobLocation,
        vacancy: this.selectedJobOffer.vacancy,
        minsalary: this.selectedJobOffer.minsalary,
        maxsalary: this.selectedJobOffer.maxsalary,
        // jobNature: this.selectedJobOffer.jobNature,
        // jobCategory: this.selectedJobOffer.jobCategory,
      });

      // Assuming you have a reference to the modal element
      const modal = new bootstrap.Modal(this.updateJobOfferModal.nativeElement);
      modal.show();
    } else {
      console.error('Selected job offer is undefined.');
    }
  }


  onSortChange(event: any): void {
    const selectedValue = event.target.value;
    console.log('Selected value:', selectedValue);

    if (selectedValue === 'Most Recent') {
      this.jobOffers.sort((a, b) => {
        const dateA = new Date(a.postedDate);
        const dateB = new Date(b.postedDate);
        return dateB.getTime() - dateA.getTime();
      });
      this.cdr.detectChanges();
    } else {
      this.router.navigate(['/JobOffer/job-offer-details', selectedValue]);
    }
  }
  resetSelects() {
    // Check if locationSelect is defined and truthy
    if (this.locationSelect && this.locationSelect.nativeElement) {
      this.locationSelect.nativeElement.value = ''; // Clear the selected option
    }
    // Repeat for other select elements if needed
  }
  salaryRangeValidator(formGroup: FormGroup) {
    const minSalary = formGroup.get('minsalary')!.value;
    const maxSalary = formGroup.get('maxsalary')!.value;
    if (minSalary !== null && maxSalary !== null && minSalary >= maxSalary) {
      formGroup.get('maxsalary')!.setErrors({ maxSmallerThanMin: true });
    } else {
      formGroup.get('maxsalary')!.setErrors(null);
    }
  }

  onUpdateJobOffer(): void {
    if (this.updateJobOfferForm.valid && this.selectedJobOffer) {
      const updatedJobOffer = {
        ...this.selectedJobOffer, // Ensure you have the job offer ID and any other non-updated fields
        ...this.updateJobOfferForm.value,
      };

      this.js.updateJobOffer(updatedJobOffer.jobOffer_id, updatedJobOffer).subscribe({
        next: () => {
          this.showModalWithMessage('Job offer updated successfully!');
          // Close the modal or perform any other necessary action
        },
        error: (error) => {
          console.error('Error updating job offer:', error);
          this.showModalWithMessage('Error updating job offer. Please try again.');
        }
      });
    } else {
      console.error('Form is invalid or selected job offer is undefined.');
      // Handle the case where the form is invalid or selected job offer is undefined
    }
  }
  getCandidaciesByJobOfferId(jobOfferId: number): void {
    // Call the service method to get candidacies by job offer ID
    this.js.getCandidaciesByJobOfferId(jobOfferId).subscribe(
      (candidacies: any) => {
        // Handle the retrieved candidacies as needed
        console.log('Candidacies for job offer ID', jobOfferId, 'retrieved successfully:', candidacies);
      },
      error => {
        console.error('Error retrieving candidacies for job offer ID', jobOfferId, ':', error);
        // Handle error accordingly
      }
    );
  }

  sortByMostRecent() {
    // Sort the jobOffers array by descending postedDate
    this.jobOffers.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }
  filterJobOffers() {
    this.filteredJobOffers = this.jobOffers.filter(jobOffer => {
      let match = true;

      // Filter by location
      if (this.selectedLocation && jobOffer.jobLocation !== this.selectedLocation.toString()) {
        match = false;
      }

      // Filter by vacancy
      if (this.selectedVacancy !== null && jobOffer.vacancy !== parseInt(this.selectedVacancy.toString())) {
        match = false;
      }

      // Filter by category
      if (this.selectedCategory && jobOffer.jobCategory !== parseInt(this.selectedCategory)) {
        match = false;
      }

      // Filter by job type
      if (this.selectedJobType && jobOffer.jobNature !== parseInt(this.selectedJobType)) {
        match = false;
      }

      return match;
    });
  }
  getCandidacies(jobOfferId: number): void {
    this.js.getCandidaciesByJobOfferId(jobOfferId)
      .subscribe(candidacies => {
        this.candidacies = candidacies;
        // Handle displaying the candidacies, e.g., update UI, show in a modal, etc.
      }, error => {
        // Handle error, e.g., show error message to the user
      });
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
}
