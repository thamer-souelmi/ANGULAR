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
    this.jobOffer = data.jobOffer; // Assign the jobOffer data from the data object
    this.jobNatureOptions = this.getEnumValues(JobNature);
    this.jobCategoryOptions = this.getEnumValues(JobCategory);
  }

  ngOnInit(): void {
    console.log(this.jobOffer);


  }

  // salaryRangeValidator(formGroup: FormGroup): void {
  //   const minSalary = formGroup.get('minsalary')!.value;
  //   const maxSalary = formGroup.get('maxsalary')!.value;
  //   if (minSalary !== null && maxSalary !== null && minSalary >= maxSalary) {
  //     formGroup.get('maxsalary')!.setErrors({ maxSmallerThanMin: true });
  //   } else {
  //     formGroup.get('maxsalary')!.setErrors(null);
  //   }
  // }

  getEnumValues(enumType: any): string[] {
    return Object.values(enumType).filter(value => typeof value === 'string') as string[];
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    // if (this.jobOfferForm.valid) {
      // const updatedJobOffer: JobOffer = this.jobOfferForm.value;
      // updatedJobOffer.jobOffer_id = this.jobOffer.jobOffer_id; // Preserve original ID
      // console.log("Submitting job offer:", updatedJobOffer);

      // this.jobOfferService.updateJobOffer(this.jobOffer).subscribe((updatedJobOffer) => {
      //   console.log("Job offer updated successfully");
      //   this.dialogRef.close(updatedJobOffer);
      // }, error => {
      //   console.error("Error updating job offer:", error);
      //   // Handle error appropriately, e.g., show error message to user
      // });
    // } else {
    //   console.error("Invalid form submission");
    //   // Handle invalid form submission, e.g., display validation errors
    // }
    this.jobOfferService.updateJobOffer(this.jobOffer).subscribe(updatedJobOffer => {
      this.dialogRef.close(updatedJobOffer);
    });
  }
}
