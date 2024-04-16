import { Component, Inject } from '@angular/core';
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
export class UpdateJobOfferComponent {
  jobOfferForm!: FormGroup;
  jobOffer: JobOffer;
  jobNatureOptions: string[];
  jobCategoryOptions: string[];

  constructor(
    private dialogRef: MatDialogRef<UpdateJobOfferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private jobOfferService: JobOfferService
  ) {
    this.jobOffer = { ...data.jobOffer };

    this.jobNatureOptions = this.getEnumValues(JobNature);
    this.jobCategoryOptions = this.getEnumValues(JobCategory);

    this.createForm();
  }

  createForm(): void {
    this.jobOfferForm = this.fb.group({
      titleJobOffer: [this.jobOffer.titleJobOffer, Validators.required],
      postedDate: [this.jobOffer.postedDate, Validators.required],
      description: [this.jobOffer.description, Validators.required],
      jobLocation: [this.jobOffer.jobLocation, Validators.required],
      applicationDeadLine: [this.jobOffer.applicationDeadLine, Validators.required],
      experience: [this.jobOffer.experience, Validators.required],
      requiredSkills: [this.jobOffer.requiredSkills, Validators.required],
      vacancy: [this.jobOffer.vacancy, [Validators.required, Validators.min(1)]],
      minsalary: [this.jobOffer.minsalary, Validators.required],
      maxsalary: [this.jobOffer.maxsalary, Validators.required],
      jobNature: [this.jobOffer.jobNature, Validators.required],
      jobCategory: [this.jobOffer.jobCategory, Validators.required]
    }, { validators: this.salaryRangeValidator });
  }

  salaryRangeValidator(formGroup: FormGroup): void {
    const minSalary = formGroup.get('minsalary')!.value;
    const maxSalary = formGroup.get('maxsalary')!.value;
    if (minSalary !== null && maxSalary !== null && minSalary >= maxSalary) {
      formGroup.get('maxsalary')!.setErrors({ maxSmallerThanMin: true });
    } else {
      formGroup.get('maxsalary')!.setErrors(null);
    }
  }

  getEnumValues(enumType: any): string[] {
    return Object.values(enumType).filter(value => typeof value === 'string') as string[];
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.jobOfferForm.valid) {
      const updatedJobOffer: JobOffer = this.jobOfferForm.value;
      updatedJobOffer.jobOffer_id = this.jobOffer.jobOffer_id; // Preserve original ID
      console.log("Submitting job offer:", updatedJobOffer);

      this.jobOfferService.updateJobOffer(updatedJobOffer).subscribe(() => {
        console.log("Job offer updated successfully");
        this.dialogRef.close(updatedJobOffer);
      }, error => {
        console.error("Error updating job offer:", error);
        // Handle error appropriately, e.g., show error message to user
      });
    } else {
      console.error("Invalid form submission");
      // Handle invalid form submission, e.g., display validation errors
    }
  }
}
