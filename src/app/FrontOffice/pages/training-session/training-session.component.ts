import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TrainingSessionService } from "../../../Services/TrainingSession.service";
import { TrainingSession } from "../../../Models/TrainingSession";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { TS_Status } from "../../../Models/TS_Status";
import { TypeTS } from "../../../Models/TypeTS";
import { throwError} from "rxjs";
import { catchError } from "rxjs/operators";

@Component({
  selector: 'app-training-session',
  templateUrl: './training-session.component.html',
  styleUrls: ['./training-session.component.css']
})
export class TrainingSessionComponent implements OnInit {
  trainingSessions: TrainingSession[] = [];
  newTrainingSessionForm: FormGroup;
  updateTrainingSessionForm: FormGroup;
  selectedTrainingSession?: TrainingSession;
  @ViewChild('addTrainingSessionModal') addTrainingSessionModal!: ElementRef;
  @ViewChild('editTrainingSessionModal') editTrainingSessionModal!: ElementRef;
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal!: ElementRef;
  private modalRef?: NgbModalRef;
  typeTSOptions = Object.values(TypeTS);
  tsStatusOptions = Object.values(TS_Status);

  constructor(
    private formBuilder: FormBuilder,
    private trainingSessionService: TrainingSessionService,
    private modalService: NgbModal
  ) {
    this.newTrainingSessionForm = this.formBuilder.group({
      title: ['', Validators.required],
      start_Date: ['', Validators.required],
      Finish_Date: ['', Validators.required],
      Topic: ['', Validators.required],
      Capacity: ['', [Validators.required, Validators.min(1)]],
      Place: ['', Validators.required],
      typeTS: [TypeTS.ONLINE, Validators.required], // Set default values or bind to selections
      tsStatus: [TS_Status.PLANNED, Validators.required],
    });


    this.updateTrainingSessionForm = this.formBuilder.group({
      title: ['', Validators.required],
      start_Date: ['', Validators.required],
      Finish_Date: ['', Validators.required],
      Topic: ['', Validators.required],
      Capacity: ['', [Validators.required, Validators.min(1)]],
      Place: ['', Validators.required],
      typeTS: [null, Validators.required],
      tsStatus: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadTrainingSessions();

  }

  loadTrainingSessions(): void {
    this.trainingSessionService.findAllRegistrationTS().subscribe({
      next: (sessions) => {
        this.trainingSessions = sessions;

      },
      error: (err) => console.error('Error loading training sessions', err)
    });
  }

  addTrainingSession(): void {
    if (this.newTrainingSessionForm.valid) {
      const formData = this.newTrainingSessionForm.value;
      const newTrainingSession: TrainingSession = {
        ...formData
      };

      console.log('Form data being sent:', newTrainingSession);

      this.trainingSessionService.addTrainingSession(newTrainingSession).pipe(
        catchError((error) => {
          console.error('Error adding training session:', error);
          alert('Failed to add training session: ' + (error.error.message || 'Unknown error'));
          return throwError(() => new Error('Error adding training session'));
        })
      ).subscribe({
        next: () => {
          console.log('Training session added successfully.');
          this.loadTrainingSessions();
          this.modalRef?.close();
          this.newTrainingSessionForm.reset();
        },
        error: (error) => console.error('Error while adding training session:', error)
      });
    } else {
      console.error('Form is invalid:', this.newTrainingSessionForm);
      this.newTrainingSessionForm.markAllAsTouched(); // Ensure all fields are touched to show validation errors.
    }
  }

  selectTrainingSession(session: TrainingSession): void {
    this.selectedTrainingSession = session;
    this.updateTrainingSessionForm.patchValue(session);
  }

  updateTrainingSession(): void {
    if (this.updateTrainingSessionForm.valid && this.selectedTrainingSession) {
      const updatedSession: TrainingSession = {
        ...this.selectedTrainingSession,
        ...this.updateTrainingSessionForm.value
      };
      this.trainingSessionService.UpdateTrainingSession(updatedSession).subscribe({
        next: () => {
          this.loadTrainingSessions();
          this.modalRef?.close();
        },
        error: (err) => console.error('Error updating training session', err)
      });
    }
  }

  deleteTrainingSession(): void {
    if (this.selectedTrainingSession && this.selectedTrainingSession.TS_id) {
      this.trainingSessionService.deleteTrainingSessionById(this.selectedTrainingSession.TS_id).subscribe({
        next: () => {
          this.loadTrainingSessions();
          this.modalRef?.close();
        },
        error: (err) => console.error('Error deleting training session', err)
      });
    }
  }

  openModal(content: any): void {
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

}

