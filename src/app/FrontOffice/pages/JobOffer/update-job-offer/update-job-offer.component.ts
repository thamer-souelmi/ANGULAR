import {Component, Inject, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobOffer } from 'src/app/Models/job-offer';
import { JobNature } from 'src/app/Models/job-nature';
import { JobCategory } from 'src/app/Models/job-category';
import { JobOfferService } from 'src/app/Services/job-offer.service';

@Component({
  selector: 'app-update-job-offer',
  templateUrl: './update-job-offer.component.html',
  styleUrls: ['./update-job-offer.component.css']
})
export class UpdateJobOfferComponent implements OnInit {
  jobOffer: JobOffer;
  jobNatureOptions: string[];
  jobCategoryOptions: string[];

  constructor(
    private dialogRef: MatDialogRef<UpdateJobOfferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private jobOfferService: JobOfferService
  ) {
    this.jobOffer = data.jobOffer;
    this.jobNatureOptions = this.getEnumValues(JobNature);
    this.jobCategoryOptions = this.getEnumValues(JobCategory);
  }

  ngOnInit(): void {
    console.log(this.jobOffer);
  }

  getEnumValues(enumType: any): string[] {
    return Object.values(enumType).filter(value => typeof value === 'string') as string[];
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.jobOfferService.updateJobOffer(this.jobOffer.jobOffer_id, this.jobOffer).subscribe(updatedJobOffer => {
      console.log("Job offer updated successfully");
      this.dialogRef.close(updatedJobOffer);
    }, error => {
      console.error("Error updating job offer:", error);
      // Handle error appropriately, e.g., show error message to user
    });
  }

}
