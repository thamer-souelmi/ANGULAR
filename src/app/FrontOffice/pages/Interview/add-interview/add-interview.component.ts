import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InterviewService } from 'src/app/Services/interview.service';
import { Candidacy } from 'src/app/Models/candidacy'; // Adjust the path as needed
import { Interview } from 'src/app/Models/interview';
import {CandidacyService} from "../../../../Services/candidacy.service";
import {StatusInterview} from "../../../../Models/status-interview";
import {StorageService} from "../../../../Services/storage.service";
import {ToastrService} from "ngx-toastr"; // Adjust the path as needed

@Component({
  selector: 'app-add-interview',
  templateUrl: './add-interview.component.html',
  styleUrls: ['./add-interview.component.css']
})
export class AddInterviewComponent implements OnInit{
  userId!: number;
  interviewForm: FormGroup;
  candidates: Candidacy[] = [];
  statusInterviewOptions: StatusInterview[]; // Change to array type
  constructor(
    private dialogRef: MatDialogRef<AddInterviewComponent>,
    private formBuilder: FormBuilder,
    private interviewService: InterviewService,
    private candidacyService: CandidacyService,private toastr: ToastrService ,private s:StorageService// Inject CandidacyService
  ) {
    this.interviewForm = this.formBuilder.group({
      candidateName: ['', Validators.required],
      dateInterview: [new Date(), Validators.required],
      statusInterview: [StatusInterview.SCHEDULED, Validators.required], // Default to SCHEDULED
      // passed: [false, Validators.required],
    });
    this.statusInterviewOptions = Object.values(StatusInterview) as StatusInterview[];
  }

  ngOnInit(): void {
    this.loadCandidates(); // Fetch candidates when component initializes
  }

  loadCandidates() {
    this.candidacyService.findAllCandidacies().subscribe(
      (candidates: Candidacy[]) => {
        this.candidates = candidates;
        console.log('Candidates:', this.candidates); // Log candidates array
      },
      (error) => {
        console.error('Error fetching candidates:', error);
        // Handle error appropriately, e.g., show error message to user
      }
    );
  }


  onSubmit() {
    if (this.interviewForm.valid) {
      const candidacy_id: number = +this.interviewForm.value.candidateName;
      const id =this.s.getUser().id;
      console.log(id)
      console.log('Selected candidacyId:', candidacy_id); // Log the selected candidacyId

      // Find the selected candidate in the candidates array
      const selectedCandidate = this.candidates.find(candidate => candidate.candidacy_id === candidacy_id);
      console.log(selectedCandidate);
      if (selectedCandidate) {
        const interview: Interview = this.interviewForm.value;

        console.log('*****************Selected candidacyId:', candidacy_id); // Log the selected candidacyId
        console.log("**************",selectedCandidate);
        console.log("**************",interview);

        // Pass the candidacy ID and interview object to the interview service
        this.interviewService.addInterview(candidacy_id,id, interview).subscribe(
          (addedInterview: Interview) => {
            console.log('Interview added successfully:', addedInterview);
            // alert('Interview added successfully!');
            this.toastr.success('Interview added successfully!', 'Success');

          },
          error => {
            console.error('Error adding interview:', error);
            alert('An unexpected error occurred while adding the interview.');
          }
        );
      } else {
        alert('Selected candidate not found.');
      }
    } else {
      alert('Please fill out all required fields.');
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Close dialog without any data
  }

  protected readonly StatusInterview = StatusInterview;
}
