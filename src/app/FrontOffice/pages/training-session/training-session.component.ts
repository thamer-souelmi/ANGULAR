import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TrainingSessionService } from "../../../Services/TrainingSession.service";
import { TrainingSession } from "../../../Models/TrainingSession";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

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
      typeTS: [null, Validators.required],
      tsStatus: [null, Validators.required],
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
      console.log('Trying to add training session:', this.newTrainingSessionForm.value);

      if (this.newTrainingSessionForm.valid) {
      console.log('Form is valid, proceeding to add...');
      const newTrainingSession: TrainingSession = this.newTrainingSessionForm.value;
      this.trainingSessionService.addTrainingSession(newTrainingSession).subscribe({
        next: () => {
          console.log('Training session added successfully.');
          this.loadTrainingSessions();
          this.modalRef?.close();
          this.newTrainingSessionForm.reset();
        },
        error: (err) => {
          console.error('Error adding training session', err);
        }
      });
    } else {
      console.error('Form is invalid:', this.newTrainingSessionForm);
      Object.keys(this.newTrainingSessionForm.controls).forEach(key => {
        const controlErrors = this.newTrainingSessionForm.get(key)?.errors;
        if (controlErrors) {
          console.error('Control', key, 'has errors:', controlErrors);
        }
      });
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
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
}
