import {Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import { TrainingSessionService } from "../../../Services/TrainingSession.service";
import { TrainingSession } from "../../../Models/TrainingSession";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { TS_Status } from "../../../Models/TS_Status";
import { TypeTS } from "../../../Models/TypeTS";
import * as bootstrap from "bootstrap";
import {ToastrService} from "ngx-toastr";
import {Room} from "../../../Models/Room";
import {MatPaginator, PageEvent} from "@angular/material/paginator";

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
  totalItems: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  totalActivities = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private formBuilder: FormBuilder,
    private trainingSessionService: TrainingSessionService,
    private modalService: NgbModal,
    private toaster: ToastrService,
    private cdr: ChangeDetectorRef,
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
      placeType: [''],  // No validators, can be null
      target_audience: [''],  // No validators, can be null
      session_outline: [''],  // No validators, can be null
      expected_outcomes: [''],  // No validators, can be null
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
    this.loadTrainingSessions(this.currentPage, this.pageSize);
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
  loadTrainingSessions(pageIndex: number, pageSize: number): void {
    this.trainingSessionService.findAllRegistrationTS(pageIndex, pageSize).subscribe({
      next: (sessions) => {
        if (sessions && Array.isArray(sessions.content)) {
          this.trainingSessions = sessions.content;
        } else {
          this.trainingSessions = []; // Ensure this is always an array
          console.warn('Expected sessions.content to be an array but received:', sessions.content);
        }
        this.totalItems = sessions.totalElements || 0; // Adjusted to use a more typical property name
        this.currentPage = sessions.currentPage || 0;
        console.log('Loaded training sessions:', this.trainingSessions);
      },
      error: (err) => {
        console.error('Error loading training sessions', err);
        this.trainingSessions = []; // Ensures fallback to an empty array on error
      }
    });
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadTrainingSessions(this.currentPage, this.pageSize);
    }
  }
  nextPage(): void {
    if (this.currentPage < (this.totalActivities / this.pageSize) - 1) {
      this.currentPage++;
      this.loadTrainingSessions(this.currentPage, this.pageSize);
    }
  }
  changePage(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTrainingSessions(this.currentPage, this.pageSize);
  }

  onPageChange(event: any): void {
    this.loadTrainingSessions(event.pageIndex, event.pageSize);
  }

  addTrainingSession(): void {
    if (this.newTrainingSessionForm.valid) {
      const formData = this.newTrainingSessionForm.getRawValue();
      console.log('Form Data:', formData);

      // Determine the correct values for 'place' and 'typeTS' based on 'placeType'
      let place = formData.placeType === 'EXTERNAL' ? 'ONLINE' : formData.place;
      let typeTS = formData.placeType === 'EXTERNAL' ? 'ONLINE' : formData.typeTS;

      const requestData = {
        title: formData.title,
        target_audience: formData.target_audience || null, // Ensuring optional fields are not sent as undefined
        session_outline: formData.session_outline || null,
        expected_outcomes: formData.expected_outcomes || null,
        start_date: formData.start_date,
        finish_date: formData.finish_date,
        topic: formData.topic,
        place: place || null,  // Handle the case where place might be undefined or not required
        capacity: formData.capacity,
        typeTS: typeTS,
        tsStatus: formData.tsStatus,
        placeType: formData.placeType || null // Handle the case where placeType might be undefined
      };

      console.log('Submitting this data to server:', requestData);

      // Determine if a room ID is needed based on the placeType
      const roomId = (formData.placeType === 'INTERNAL' && formData.room) ? formData.room.id : null;

      // Choose the correct endpoint based on the room ID presence
      if (roomId == null) {
        this.trainingSessionService.addTrainingSessionWithoutRoom(requestData).subscribe(
          data => {
            console.log('Training session added successfully:', data);
            this.toaster.success('Training session added successfully');
            this.modalService.dismissAll();
            this.newTrainingSessionForm.reset();
            this.loadTrainingSessions(this.currentPage, this.pageSize);
            this.cdr.detectChanges();

          },
          error => {
            console.error('Error when trying to add session:', error);
            this.toaster.error(`Error adding training session: ${error.error?.message || 'Unknown error'}`);
          }
        );
      } else {
        this.trainingSessionService.addTrainingSessionWithRoom(requestData, roomId).subscribe(
          data => {
            console.log('Training session added successfully with room:', data);
            this.toaster.success('Training session added successfully with room');
            this.modalService.dismissAll();
            this.newTrainingSessionForm.reset();
            this.loadTrainingSessions(this.currentPage, this.pageSize);
          },
          error => {
            console.error('Error when trying to add session with room:', error);
            this.toaster.error(`Error adding training session with room: ${error.error?.message || 'Unknown error'}`);
          }
        );
      }
    } else {
      console.error('Form is invalid:', this.newTrainingSessionForm.value);
      this.newTrainingSessionForm.markAllAsTouched();
      this.toaster.error('Please complete all required fields.');
    }
  }


  private handleResponse(data: TrainingSession): void {
    console.log('Server Response:', data);
    this.toaster.success('Training session added successfully');
    this.modalService.dismissAll();
    this.newTrainingSessionForm.reset();
    setTimeout(() => window.location.reload(), 1000);
  }

  private handleError(error: any): void {
    console.error('Error when trying to add session:', error);
    const errorMsg = error.error?.message || 'Unknown error';
    this.toaster.error(`Error adding training session: ${errorMsg}`);
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
          this.loadTrainingSessions(this.currentPage, this.pageSize);
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
          this.loadTrainingSessions(this.currentPage, this.pageSize);


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

