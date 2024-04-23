import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  Router } from '@angular/router';
import { Interview } from 'src/app/Models/interview';
import {UpdateInterviewComponent} from "../update-interview/update-interview.component";
import { JitsiComponent } from '../jitsi/jitsi.component'; // Import the JitsiComponent

@Component({
  selector: 'app-interview-details',
  templateUrl: './interview-details.component.html',
  styleUrls: ['./interview-details.component.css']
})
export class InterviewDetailsComponent implements OnInit{
  interview :Interview;
  constructor(private dialogRef: MatDialogRef<InterviewDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private router: Router) {
    this.interview = data.interview;
  }

  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }
  openUpdateModal(): void {
    const dialogRef = this.dialog.open(UpdateInterviewComponent, {
      width: '600px',
      data: { project: this.interview }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  // Function to open the Jitsi meeting
  openJitsiMeeting(): void {
    const dialogRef = this.dialog.open(JitsiComponent, {
      width: '900px', // Adjust width and height as needed
      height: '500px',
      data: { interview: this.interview }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any actions after the meeting is closed
    });
  }

}
