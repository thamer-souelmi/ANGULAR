import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InterviewService } from 'src/app/Services/interview.service';
import { Candidacy } from 'src/app/Models/candidacy'; // Adjust the path as needed
import { Interview } from 'src/app/Models/interview';
import {CandidacyService} from "../../../../Services/candidacy.service"; // Adjust the path as needed

@Component({
  selector: 'app-add-interview',
  templateUrl: './add-interview.component.html',
  styleUrls: ['./add-interview.component.css']
})
export class AddInterviewComponent implements OnInit{
  interviewForm: FormGroup;
  candidates: Candidacy[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddInterviewComponent>,
    private formBuilder: FormBuilder,
    private interviewService: InterviewService,
    private candidacyService: CandidacyService // Inject CandidacyService
  ) {
    this.interviewForm = this.formBuilder.group({
      candidateName: ['', Validators.required],
      dateInterview: [new Date(), Validators.required],
      statusInterview: [0, Validators.required],
      // passed: [false, Validators.required],
    });
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


  // AddInterviewComponent.ts
  onSubmit() {
    if (this.interviewForm.valid) {
      const candidacyId: number = +this.interviewForm.value.candidateName;

      console.log('Selected candidacyId:', candidacyId); // Log the selected candidacyId

      // Find the selected candidate in the candidates array
      const selectedCandidate = this.candidates.find(candidate => candidate.candidacy_id === candidacyId);

      if (selectedCandidate) {
        const interview: Interview = this.interviewForm.value;

        // Pass the candidacy ID and interview object to the interview service
        this.interviewService.addInterview(candidacyId, interview).subscribe(
          (addedInterview: Interview) => {
            console.log('Interview added successfully:', addedInterview);
            alert('Interview added successfully!');
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
}
