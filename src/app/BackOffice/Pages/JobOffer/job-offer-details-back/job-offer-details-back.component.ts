import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  Router } from '@angular/router';
import { JobOffer } from 'src/app/Models/job-offer';
@Component({
  selector: 'app-job-offer-details-back',
  templateUrl: './job-offer-details-back.component.html',
  styleUrls: ['./job-offer-details-back.component.css']
})
export class JobOfferDetailsBackComponent implements OnInit{
  jobOffer :JobOffer;
  constructor(private dialogRef: MatDialogRef<JobOfferDetailsBackComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private router: Router) {
    this.jobOffer = data.jobOffer;

  }
  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
