import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  Router } from '@angular/router';
import { Interview } from 'src/app/Models/interview';
import {UpdateInterviewComponent} from "../update-interview/update-interview.component";
import { JitsiComponent } from '../jitsi/jitsi.component';
import {InterviewService} from "../../../../Services/interview.service"; // Import the JitsiComponent

@Component({
  selector: 'app-interview-details',
  templateUrl: './interview-details.component.html',
  styleUrls: ['./interview-details.component.css']
})
export class InterviewDetailsComponent implements OnInit{
  interview :Interview;
  constructor(private dialogRef: MatDialogRef<InterviewDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private router: Router,private interviewService: InterviewService) {
    this.interview = data.interview;
  }

  ngOnInit(): void {
  }
  // togglePassed(passed: boolean) {
  //   this.interview.passed = passed;
  // }
  // togglePassed(passed: boolean) {
  //   // Update interview details in the database
  //   const interviewId = this.interview.interview_id; // Ensure this is the correct property name
  //   this.interviewService.updateInterviewResult(interviewId, passed).subscribe(
  //     () => {
  //       // Update the local interview object with the updated passed attribute
  //       this.interview.passed = passed;
  //       console.log("*****************", passed);
  //       // Optionally, handle success response or perform any additional actions
  //       console.log('Interview updated successfully');
  //     },
  //     error => {
  //       // Handle error
  //       console.log("*****************", passed);
  //       console.error('Error updating interview:', error);
  //     }
  //   );
  // }

  onClose(): void {
    this.dialogRef.close();
  }
  openUpdateModal(interviewId: number): void {
    this.interviewService.getInterviewById(interviewId).subscribe(interview => {
      this.dialog.open(UpdateInterviewComponent, {
        data: {
          interview: interview
        }
      });
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
