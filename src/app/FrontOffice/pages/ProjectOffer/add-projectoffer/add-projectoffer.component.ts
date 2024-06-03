import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectOffer, ProjectOfferStatus } from 'src/app/Models/project-offer';
import { ProjectOfferService } from 'src/app/Services/project-offer.service';
import { Location } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core'; // Import ChangeDetectorRef
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-add-projectoffer',
  templateUrl: './add-projectoffer.component.html',
  styleUrls: ['./add-projectoffer.component.css']
})
export class AddProjectofferComponent {
  protected aFormGroup: FormGroup | undefined;
  siteKey: string = '6LeCnZUpAAAAAMDRTsdCXxDoRlyGZoojn4E0JKUu';
  ProjectOfferForm: FormGroup;
  projectoffer: ProjectOffer = new ProjectOffer();
  etatValues = Object.values(ProjectOfferStatus);





  constructor(      public dialogRef: MatDialogRef<AddProjectofferComponent> // Inject MatDialogRef
    ,  @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private projectOfferService: ProjectOfferService, private location: Location, private router: Router) {
    this.ProjectOfferForm = this.formBuilder.group({
      projectTitle: ['', Validators.required],
      description: ['', Validators.required],
      companyname: ['', Validators.required],
      companyemail: ['', Validators.required],
      status: ['PENDING', Validators.required],
      postedDate: [this.data.date], // Initialize with the passed date

    });
  }
  ngOnInit() {
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });
  }

  // onSubmit() {
  //   if (this.ProjectOfferForm.valid) {
  //     const projectOffer: ProjectOffer = this.ProjectOfferForm.value;
  //     this.projectOfferService.addProjectOffer(projectOffer).subscribe(
  //       (addedProjectOffer: ProjectOffer) => {
  //         console.log('Project offer added successfully:', addedProjectOffer);
  //         alert('Project offer added successfully!' + addedProjectOffer);
  //         this.dialogRef.close(); // Close the dialog
  //       },
  //       error => {
  //         console.error('Error adding project offer:', error);
  //       }
  //     );
  //   }
  // }

  onSubmit() {

    if (this.ProjectOfferForm.valid) {
      const projectOffer: ProjectOffer = this.ProjectOfferForm.value;
      const statusValue = this.ProjectOfferForm.get('status')?.value;
      console.log('project offet STATUS', statusValue);

      // No need to manually set the status here since it's already included in the form value

      this.projectOfferService.addProjectOffer(projectOffer).subscribe(
        (addedProjectOffer: ProjectOffer) => {

          console.log('Project offer added successfully:', addedProjectOffer);
          alert('Project offer added successfully!' + addedProjectOffer);

          this.dialogRef.close(); // Close the dialog

        },
        error => {
          console.error('Error adding project offer:', error);
        }
      );
    }
  }

  // Optional: If you have custom logic that might modify projectOffer.status

  cancel() {
    this.location.back();
  }

}


