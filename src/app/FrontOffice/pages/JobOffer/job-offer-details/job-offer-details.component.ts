import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobOffer } from 'src/app/Models/job-offer';
import { JobOfferService } from 'src/app/Services/job-offer.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import { Candidacy } from 'src/app/Models/candidacy';
import { CandidacyService } from 'src/app/Services/candidacy.service';
import {Location, NgIf} from '@angular/common';
import {HttpEventType, HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-job-offer-details',
  templateUrl: './job-offer-details.component.html',
  imports: [
    NgIf,
    ReactiveFormsModule

  ],
  standalone: true,
  styleUrls: ['./job-offer-details.component.css']
})
export class JobOfferDetailsComponent implements OnInit {
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
  constructor(
    private route: ActivatedRoute,
    private jobOfferService: JobOfferService,private formBuilder: FormBuilder,
    private candidacyService: CandidacyService,
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
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.jobId = +params['id'];
      console.log('Job ID:', this.jobId);
      this.loadJobOfferDetails();
    });
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
  addToWishlist(jobOffer: JobOffer): void {
    // Add the job offer to the wishlist
    this.jobOfferService.addToWishlist(jobOffer).subscribe(
      () => {
        console.log('Job offer added to wishlist:', jobOffer);
        // Provide any feedback to the user if needed
      },
      (error) => {
        console.error('Error adding job offer to wishlist', error);
      }
    );
  }
  onSubmit() {
    const newc: Candidacy = this.candidacyForm.value as Candidacy;
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      newc.cv = this.selectedFiles[0].name;
    }
    this.candidacyService.addCandidate(newc).subscribe(
      response => {
        console.log('candidate added successfully:', response);
        this.candidacyForm.reset();

      },
      error => {
        console.error('Error adding candidate:', error);
      }
    );
    this.uploadFiles();

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
