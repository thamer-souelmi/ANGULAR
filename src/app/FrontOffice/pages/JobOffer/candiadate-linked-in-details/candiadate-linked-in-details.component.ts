import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  Router } from '@angular/router';
import { Candidacy } from 'src/app/Models/candidacy';

@Component({
  selector: 'app-candiadate-linked-in-details',
  templateUrl: './candiadate-linked-in-details.component.html',
  styleUrls: ['./candiadate-linked-in-details.component.css']
})
export class CandiadateLinkedInDetailsComponent implements OnInit{
  candidate :Candidacy;
  constructor(private dialogRef: MatDialogRef<CandiadateLinkedInDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private router: Router) {
    this.candidate = data.candidate;

  }
  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
