import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TrainingSessionService } from "../../../Services/TrainingSession.service";
import { TrainingSession } from "../../../Models/TrainingSession";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { TS_Status } from "../../../Models/TS_Status";
import { TypeTS } from "../../../Models/TypeTS";
import { throwError} from "rxjs";
import { catchError } from "rxjs/operators";
import * as bootstrap from "bootstrap";
import {ToastrService} from "ngx-toastr";

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
  warningMessage: string = '';
  @ViewChild('warningSuccessModal') warningSuccessModal!: ElementRef;
  showPlaceField = false;  // Control visibility of the Place field

  constructor(
    private formBuilder: FormBuilder,
    private trainingSessionService: TrainingSessionService,
    private modalService: NgbModal,
    private toastr: ToastrService,
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
    this.onTypeChange();  // Call it on init in case the form defaults to a value that should show/hide the Place

  }
  onTypeChange(): void {
    // Check the current value of typeTS and toggle showPlaceField accordingly
    const type = this.newTrainingSessionForm.get('typeTS')?.value;
    this.showPlaceField = type === TypeTS.OFFLINE;
  }
  showModalWithMessage(message: string): void {
    this.warningMessage = message;
    const modalInstance = new bootstrap.Modal(this.warningSuccessModal.nativeElement);
    modalInstance.show();
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
          this.toastr.error('Failed to add training session: ' + (error.error.message || 'Unknown error')); // Use toast for error feedback
          return throwError(() => new Error('Error adding training session'));
        })
      ).subscribe({
        next: () => {
          console.log('Training session added successfully.');
          this.toastr.success('Training session added successfully'); // Show success toast
          this.loadTrainingSessions(); // Load or refresh session list
          this.newTrainingSessionForm.reset();
          setTimeout(() => {
            window.location.reload();
          },3000);

},
        error: (error) => {
          console.error('Error while adding training session:', error);
          this.toastr.error('Error adding training session: ' + (error.message || 'Unknown error')); // Optionally show error toast
        }
      });
    } else {
      console.error('Form is invalid:', this.newTrainingSessionForm);
      this.newTrainingSessionForm.markAllAsTouched(); // Ensure all fields are touched to show validation errors.
    }
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

  selectTrainingSession(session: TrainingSession): void {
    console.log("Session selected for operations:", session);
    this.selectedTrainingSession = session; // Ensure this is correctly assigning the session
  }

  openDeleteModal(session: TrainingSession, id: number | undefined) {
    this.selectTrainingSession(session);
    console.log("Selected session for deletion (in openDeleteModal):", this.selectedTrainingSession);

    // Immediately log the session ID to verify it's correctly set
    console.log("Session ID at modal open:", this.selectedTrainingSession?.ts_id);


  }



  deleteTrainingSession(): void {
    console.log("Attempting to delete training session with stored session:", this.selectedTrainingSession);

    if (this.selectedTrainingSession?.ts_id) {
      console.log("Deleting session with ID:", this.selectedTrainingSession.ts_id);
      this.trainingSessionService.deleteTrainingSessionById(this.selectedTrainingSession.ts_id).subscribe({
        next: () => {
          console.log("Training session deleted successfully.");
          this.loadTrainingSessions();


        },
        error: (err) => {
          console.error("Error deleting training session", err);
          this.toastr.error('Error deleting training session: ' + (err.message || 'Unknown error'));
        }
      });
    } else {
      console.error("No session selected or missing ID");
      this.toastr.error('No session selected or session ID is missing');
    }
    window.location.reload();

  }


  openModal(content: any): void {
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  protected readonly TrainingSession = TrainingSession;
}

