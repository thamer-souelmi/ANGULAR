import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Interview } from 'src/app/Models/interview';
import { StatusInterview } from 'src/app/Models/status-interview';
import { InterviewService } from 'src/app/Services/interview.service';
import {ToastrService} from "ngx-toastr";
@Component({
  selector: 'app-update-interview',
  templateUrl: './update-interview.component.html',
  styleUrls: ['./update-interview.component.css']
})
export class UpdateInterviewComponent implements OnInit{
  interview: Interview;
  statusOptions: StatusInterview[] = Object.values(StatusInterview) as StatusInterview[];

  constructor(
    private dialogRef: MatDialogRef<UpdateInterviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private interviewService: InterviewService,private toastr: ToastrService
  ) {
    this.interview = { ...data.interview };
  }

  ngOnInit(): void {
    console.log("Interview data:", this.interview);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    console.log("Submitting interview:", this.interview);
    const interviewId = this.interview.interview_id; // Assuming interview_id is the ID property
    this.interviewService.updateInterview(interviewId, this.interview).subscribe(updatedInterview => {
      console.log("Updated interview:", updatedInterview);
      this.toastr.success('Interview updated successfully!', 'Success');
      this.dialogRef.close(updatedInterview);
    });
  }

}
