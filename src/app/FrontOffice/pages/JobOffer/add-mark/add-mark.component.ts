import {Component, Inject} from '@angular/core';
import {MarkService} from "../../../../Services/mark.service";
import {Mark} from "../../../../Models/mark";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {CandidacyService} from "../../../../Services/candidacy.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ToastrService} from "ngx-toastr";
import {Candidacy} from "../../../../Models/candidacy"; // Adjust the path as needed

@Component({
  selector: 'app-add-mark',
  templateUrl: './add-mark.component.html',
  styleUrls: ['./add-mark.component.css']
})
export class AddMarkComponent {
  markForm: FormGroup;
  candidates: Candidacy[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddMarkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private markService: MarkService,private formBuilder: FormBuilder,
    private http: HttpClient,private candidateService: CandidacyService,private toastr: ToastrService
  ) {
    this.markForm = this.formBuilder.group({
      candidateName: ['', Validators.required],
      html: [0, Validators.required],
      python: [0, Validators.required],
      java: [0, Validators.required],
      c: [0, Validators.required],
      javascript: [0, Validators.required],
      kotlin: [0, Validators.required],
      swift: [0, Validators.required],
      react: [0, Validators.required],
      angular: [0, Validators.required],
      spring: [0, Validators.required],
    });
  }
  ngOnInit(): void {
    this.loadCandidates(); // Fetch candidates when component initializes
  }

  loadCandidates() {
    this.candidateService.findAllCandidacies().subscribe(
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

  submitMark() {
    if (this.markForm.valid) {
      const selectedCandidateName: string = this.markForm.value.candidateName;
      console.log('Selected candidate name:', selectedCandidateName); // Log the selected candidate's name

      // Find the selected candidate in the candidates array
      const selectedCandidate = this.candidates.find(candidate => candidate.candidateName === selectedCandidateName);
      if (selectedCandidate) {
        const candidacyId: number = selectedCandidate.candidacy_id;
        console.log('Selected candidacyId:', candidacyId); // Log the selected candidacyId

        const mark: Mark = {
          candidateName: selectedCandidateName,
          html: this.markForm.value.html,
          python: this.markForm.value.python,
          java: this.markForm.value.java,
          c: this.markForm.value.c,
          javascript: this.markForm.value.javascript,
          kotlin: this.markForm.value.kotlin,
          swift: this.markForm.value.swift,
          react: this.markForm.value.react,
          angular: this.markForm.value.angular,
          spring: this.markForm.value.spring
        };

        // Pass the mark object and candidacyId to the mark service
        this.markService.addMark(mark, candidacyId).subscribe(
          (addedMark: Mark) => {
            console.log('Mark added successfully:', addedMark);
            this.toastr.success('Mark added successfully!', 'Success');
          },
          error => {
            console.error('Error adding mark:', error);
            alert('An unexpected error occurred while adding the mark.');
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
