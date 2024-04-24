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
import {Room} from "../../../Models/Room";

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
  showPlaceField = false;
  showInternalOption = false;
  showAvailableRooms = false;
  availableRooms: Room[] = [];
  isSubmitting: boolean = false;
  @ViewChild('sessionDetailsModal') sessionDetailsModal!: ElementRef;
  selectedRoom: Room | null = null;
  @ViewChild('roomDetailsModal') roomDetailsModal!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private trainingSessionService: TrainingSessionService,
    private modalService: NgbModal,
    private toaster: ToastrService,
  ) {
    this.newTrainingSessionForm = this.formBuilder.group({
      title: ['', Validators.required],
      start_date: ['', Validators.required],
      finish_date: ['', Validators.required],
      topic: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      typeTS: ['', Validators.required],
      tsStatus: ['', Validators.required],
      place: [''],  // No validators, can be null
      room: [''],  // No validators, can be null
      placeType: ['']  // No validators, can be null
    });



    this.updateTrainingSessionForm = this.formBuilder.group({
      title: ['', Validators.required],
      start_date: ['', Validators.required],
      finish_date: ['', Validators.required],
      topic: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      place: ['', Validators.required],
      typeTS: [null, Validators.required],
      tsStatus: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadTrainingSessions();
    this.onTypeChange();

  }
  onTypeChange(): void {
    const type = this.newTrainingSessionForm.get('typeTS')?.value;
    this.showPlaceField = type === TypeTS.OFFLINE;
    this.showInternalOption = type === TypeTS.OFFLINE;
    this.showAvailableRooms = type === TypeTS.OFFLINE && this.newTrainingSessionForm.get('placeType')?.value === 'INTERNAL';
  }
  openDetails(session: TrainingSession): void {
    this.selectedTrainingSession = session;
    this.modalService.open(this.sessionDetailsModal);
  }


  onPlaceTypeChange(): void {
    const placeType = this.newTrainingSessionForm.get('placeType')?.value;
    this.showAvailableRooms = placeType === 'INTERNAL';
    if (this.showAvailableRooms) {
      this.loadAvailableRooms();
    } else {
      this.availableRooms = []; // Clear rooms if not 'INTERNAL'
      this.newTrainingSessionForm.patchValue({ roomId: null }); // Clear selected room
    }
  }
  openRoomDetails(room: Room): void {
    this.selectedRoom = room;
    // Use the modal service to open the Room Details Modal
    this.modalService.open(this.roomDetailsModal);
  }

  loadAvailableRooms(): void {
    this.trainingSessionService.getAvailableRooms().subscribe({
      next: (rooms) => this.availableRooms = rooms,
      error: (err) => {
        console.error('Error fetching available rooms', err);
        this.toaster.error('Failed to fetch available rooms');
      }
    });
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
        console.log(sessions);

      },
      error: (err) => console.error('Error loading training sessions', err)
    });
  }

//   addTrainingSession(): void {
//     if (this.newTrainingSessionForm.valid) {
//       const formData = this.newTrainingSessionForm.value;
//       const newTrainingSession: TrainingSession = {
//         ...formData
//       };
//
//       console.log('Form data being sent:', newTrainingSession);
//
//       this.trainingSessionService.addTrainingSession(newTrainingSession).pipe(
//         catchError((error) => {
//           console.error('Error adding training session:', error);
//           this.toaster.error('Failed to add training session: ' + (error.error.message || 'Unknown error')); // Use toast for error feedback
//           return throwError(() => new Error('Error adding training session'));
//         })
//       ).subscribe({
//         next: () => {
//           console.log('Training session added successfully.');
//           this.toaster.success('Training session added successfully'); // Show success toast
//           this.loadTrainingSessions(); // Load or refresh session list
//           this.newTrainingSessionForm.reset();
//           setTimeout(() => {
//             window.location.reload();
//           },3000);
//
// },
//         error: (error) => {
//           console.error('Error while adding training session:', error);
//           this.toaster.error('Error adding training session: ' + (error.message || 'Unknown error')); // Optionally show error toast
//         }
//       });
//     } else {
//       console.error('Form is invalid:', this.newTrainingSessionForm);
//       this.newTrainingSessionForm.markAllAsTouched(); // Ensure all fields are touched to show validation errors.
//     }
//   }
  addTrainingSession(): void {
    if (this.newTrainingSessionForm.valid) {
      const formData = this.newTrainingSessionForm.getRawValue();
      console.log('Form Data:', formData);

      // Determine if a room ID is needed based on session type
      if (formData.typeTS === TypeTS.ONLINE || formData.placeType !== 'INTERNAL') {
        formData.roomId = null; // No room ID needed for online or external sessions
      } else {
        formData.roomId = formData.room?.id; // Get the room ID if the room is defined
      }

      // Proceed only if a room ID is set or not needed
      if (formData.roomId || formData.typeTS === TypeTS.ONLINE || formData.placeType !== 'INTERNAL') {
        this.trainingSessionService.addTrainingSession(formData, formData.roomId).subscribe({
          next: () => {
            this.toaster.success('Training session added successfully');
            this.modalService.dismissAll();
            this.newTrainingSessionForm.reset();
            // Reload the page to reflect new changes
            setTimeout(() => {
              window.location.reload();
            }, 1000); // Delay the reload for 1 second to ensure all messages are shown
          },
          error: (error) => {
            console.error('Error when trying to add session:', error);
            this.toaster.error('Error adding training session: ' + (error.error.message || 'Unknown error'));
          }
        });
      } else {
        this.toaster.error('No valid room selected for internal session.');
      }
    } else {
      console.error('Form is invalid:', this.newTrainingSessionForm.value);
      this.newTrainingSessionForm.markAllAsTouched();
      this.toaster.error('Please complete all required fields.');
    }
  }

  onRoomSelect() {
    // Here you get the value from the form and check if it's not null
    const room: Room | null = this.newTrainingSessionForm.get('room')?.value ?? null;
    if (room) {
      this.selectedRoom = room;
    } else {
      // Handle the case when no room is selected or the value is null
      this.selectedRoom = null;
    }
  }
  openRoomDetailsModal() {
    if (this.selectedRoom) {
      // Logic to open modal goes here
      this.openRoomDetails(this.selectedRoom);
    } else {
      console.error('No room selected');
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
          this.toaster.error('Error deleting training session: ' + (err.message || 'Unknown error'));
        }
      });
    } else {
      console.error("No session selected or missing ID");
      this.toaster.error('No session selected or session ID is missing');
    }
    window.location.reload();

  }


  openModal(content: any): void {
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

}

