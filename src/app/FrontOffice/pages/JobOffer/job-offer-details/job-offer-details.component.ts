import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import { JobOffer } from 'src/app/Models/job-offer';
import { JobOfferService } from 'src/app/Services/job-offer.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import { Candidacy } from 'src/app/Models/candidacy';
import { CandidacyService } from 'src/app/Services/candidacy.service';
import {Location, NgIf} from '@angular/common';
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-job-offer-details',
  templateUrl: './job-offer-details.component.html',
    imports: [
        NgIf,
        ReactiveFormsModule,
        MatButtonModule,
        MatTooltipModule

    ],
  standalone: true,
  styleUrls: ['./job-offer-details.component.css']
})
export class JobOfferDetailsComponent implements OnInit {
  wishlist: JobOffer[] = [];
  jobId: number = 0;
  jobOffer: JobOffer = {} as JobOffer;
  candidacyForm: FormGroup;
  cvFile: File | null = null;
  currentDate: Date = new Date(); // Property to hold the current date
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];

  cvSrcs: (string | ArrayBuffer | null)[] = [];
  previews: string[] = [];
  cv?: Observable<any>;
  public id!: string | null;

  constructor(
    private route: ActivatedRoute,
    private jobOfferService: JobOfferService,private formBuilder: FormBuilder,
    private candidacyService: CandidacyService,private toastr: ToastrService
  ) {
    this.candidacyForm = this.formBuilder.group({
      candidateName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      link: ['', [Validators.pattern(/^(ftp|http|https):\/\/[^ "]+$/)]], // Using regular expression directly
      linkedin: ['', [Validators.pattern(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_]+\/$/)]],
      github: ['', [Validators.pattern(/^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9\-_]+$/)]],
      coverLetter: [''],
      submissionDate: [new Date()],
      // candidacyStatus: [0, Validators.required],
    });
    this.route.queryParams.subscribe((params: Params) => {
      console.log(params);
    });

  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.jobId = +params['id'];
      console.log('Job ID:', this.jobId);
      this.loadJobOfferDetails();
    });
    this.id = this.route.snapshot.paramMap.get('id');
  }


  loadJobOfferDetails(): void {
    // Fetch the job offer details using the service
    this.jobOfferService.getJobOfferById(this.jobId).subscribe(
      (result) => {
        this.jobOffer = result;
      },
      (error) => {
        console.error('Error loading job offer details', error);
      }
    );
  }
  addToWishlist(jobOffer: JobOffer) {
    if (!this.isInWishlist(jobOffer)) {
      this.wishlist.push(jobOffer);
      this.saveWishlist();
      this.toastr.success('Job offer added to wishlist!', 'Success');
    } else {
      this.toastr.info('Job offer is already in the wishlist!', 'Info');
    }
  }
  isInWishlist(jobOffer: JobOffer): boolean {
    return this.wishlist.some(item => item.jobOffer_id === jobOffer.jobOffer_id);
  }
  loadWishlist() {
    const storedWishlist = localStorage.getItem('wishlist');
    this.wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
  }
  saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));

  }
  onSubmit() {
    const newc: Candidacy = this.candidacyForm.value as Candidacy;
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      newc.cv = this.selectedFiles[0].name;
    }

    if (this.jobId !== null) {
      this.candidacyService.addCandidate(newc, this.jobId).subscribe(
        response => {
          // Handle success, if needed
          console.log('Candidate added successfully:', response);
          this.candidacyForm.reset();
          this.uploadFiles();
          this.toastr.success('Your application to the job offer has been successfully submitted.', 'Success');
        },
        error => {
          // Handle error
          console.error('Error adding candidate:', error);
          this.toastr.error('Failed to apply to job offer. Please try again later.', 'Error');

        }
      );
    } else {
      console.error('Job ID is not available.');
    }


  }
  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }
  uploadFiles(): void {
    this.message = [];

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }
  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    if (file) {
      this.candidacyService.upload(file).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
            this.cv = this.candidacyService.getFiles();
          }
        },
        error: (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        }});
    }
  }
  createCvFromBlob(cv: Blob): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.cvSrcs.push(reader.result);
    }, false);

    if (cv) {
      reader.readAsDataURL(cv);
    }
  }
}
