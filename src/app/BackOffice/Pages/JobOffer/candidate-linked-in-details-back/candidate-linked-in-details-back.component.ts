import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  Router } from '@angular/router';
import { Candidacy } from 'src/app/Models/candidacy';
@Component({
  selector: 'app-candidate-linked-in-details-back',
  templateUrl: './candidate-linked-in-details-back.component.html',
  styleUrls: ['./candidate-linked-in-details-back.component.css']
})
export class CandidateLinkedInDetailsBackComponent implements OnInit{
  candidate :Candidacy;
  constructor(private dialogRef: MatDialogRef<CandidateLinkedInDetailsBackComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private router: Router) {
    this.candidate = data.candidate;

  }
  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
