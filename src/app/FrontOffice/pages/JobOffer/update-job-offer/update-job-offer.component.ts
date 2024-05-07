import {Component, Inject, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobOffer } from 'src/app/Models/job-offer';
import { JobNature } from 'src/app/Models/job-nature';
import { JobCategory } from 'src/app/Models/job-category';
import { JobOfferService } from 'src/app/Services/job-offer.service';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-update-job-offer',
  templateUrl: './update-job-offer.component.html',
  styleUrls: ['./update-job-offer.component.css']
})
export class UpdateJobOfferComponent implements OnInit {
  jobOffer: JobOffer;
  jobNatureOptions: JobNature[] = Object.values(JobNature) as JobNature[];
  jobCategoryOptions: JobCategory[] = Object.values(JobCategory) as JobCategory[];

  constructor(
    private dialogRef: MatDialogRef<UpdateJobOfferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private jobOfferService: JobOfferService,private toastr: ToastrService
  ) {
    this.jobOffer = { ...data.jobOffer };
  }

  ngOnInit(): void {
    console.log("Job offer data:", this.jobOffer);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    console.log("Submitting job offer:", this.jobOffer);
    const jobOfferId = this.jobOffer.jobOffer_id; // Assuming jobOffer_id is the ID property
    this.jobOfferService.updateJobOffer(jobOfferId, this.jobOffer).subscribe(updatedJobOffer => {
      console.log("Updated job offer:", updatedJobOffer);
      this.toastr.success('Job Offer successfully!', 'Success');
      this.dialogRef.close(updatedJobOffer);
    });
  }

}
