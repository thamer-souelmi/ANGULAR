import {Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, TemplateRef} from '@angular/core';
import { TrainingSessionService } from "../../../Services/TrainingSession.service";
import { TrainingSession } from "../../../Models/TrainingSession";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {NgbModal, NgbModalOptions, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { TS_Status } from "../../../Models/TS_Status";
import { TypeTS } from "../../../Models/TypeTS";
import * as bootstrap from "bootstrap";
import {ComponentType, ToastrService} from "ngx-toastr";
import {Room} from "../../../Models/Room";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {User} from "../../../Models/User";
import {UserService} from "../../../Services/user.service";
import {Subject} from "rxjs";
import * as _ from "lodash";
import {StorageService} from "../../../Services/storage.service";
import {RegistrationTSService} from "../../../Services/RegistrationTS.service";
declare global {
  interface Window {
    JitsiMeetExternalAPI?: any; // Use `any` or define a more specific type if available
  }
}
@Component({
  selector: 'app-training-session',
  templateUrl: './training-session.component.html',
  styleUrls: ['./training-session.component.css']
})
export class TrainingSessionComponent implements OnInit {
  trainingSessions: TrainingSession[] = [];
  newTrainingSessionForm: FormGroup;
  updateStatusForm: FormGroup; // Define this form group
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
  public Editor = ClassicEditor;
  filteredEvents: TrainingSession[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('jitsiContainer', { static: false }) jitsiContainer!: ElementRef;
  @ViewChild('jitsiModal') jitsiModal!: TemplateRef<any>;

  users: User[] = [];  // Array to hold the potential trainers
  searchQuery: string = '';
  searchChanged: Subject<string> = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private trainingSessionService: TrainingSessionService,
    private modalService: NgbModal,
    private toaster: ToastrService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private userService :UserService,
  private storageService: StorageService,
private registrationService: RegistrationTSService
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
      trainer: ['', Validators.required],
    });

    this.updateStatusForm = this.formBuilder.group({
      tsStatus: ['', Validators.required], // Only status field required
    });
    // this.loadUsers();  // Load users on init

  }
  applyFilter(): void {
    const filtered = _.deburr(this.searchQuery.toLowerCase());

    this.filteredEvents = this.trainingSessions.filter(trainingsession => {
      const nameMatch = _.deburr(trainingsession.title.toLowerCase()).includes(filtered);
      const descriptionMatch = _.deburr(trainingsession.tsStatus.toLowerCase()).includes(filtered);
      const averageMatch = _.deburr(trainingsession.capacity?.toString().toLowerCase()).includes(filtered);
      const place = _.deburr(trainingsession.place?.toString().toLowerCase()).includes(filtered);

      return nameMatch || descriptionMatch || averageMatch || place ;
    });
  }
  loadUsers() {
    this.userService.findAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        console.log('Users loaded:', this.users);
      },
      error: (error) => {
        console.error('Failed to load users:', error);
        this.toaster.error('Failed to load users. Please check the server.');
      }
    });
  }

  ngOnInit(): void {
    this.loadTrainingSessions(this.currentPage, this.pageSize);
    this.onTypeChange();
    this.applyFilter();
    this.loadUsers();
  }


  openJitsiModal() {
    this.modalService.open(this.jitsiModal, { size: 'lg' });
  }
  confirmAndChangeStatus(session: TrainingSession, newStatus: TS_Status): void {
    if (!session.ts_id) {
      this.toaster.error('Session ID is missing');
      return;
    }

    const confirmChange = confirm(`Are you sure you want to change the status to ${newStatus}?`);
    if (confirmChange) {
      this.trainingSessionService.updateTrainingSessionStatus(session.ts_id, newStatus)
        .subscribe({
          next: () => {
            this.toaster.success('Status updated successfully');
            session.tsStatus = newStatus; // Update the local state
          },
          error: () => this.toaster.error('Failed to update status')
        });
    }
  }

  updateTrainingSessionStatus(): void {
    if (this.updateStatusForm.valid && this.selectedTrainingSession && this.selectedTrainingSession.ts_id !== undefined) {
      const statusControl = this.updateStatusForm.get('tsStatus');

      if (!statusControl) {
        this.toaster.error('Status control is missing in the form');
        return;
      }

      const status = statusControl.value;
      this.trainingSessionService.updateTrainingSessionStatus(this.selectedTrainingSession.ts_id, status).subscribe({
        next: () => {
          this.toaster.success('Status updated successfully');
          if (this.selectedTrainingSession) {
            this.selectedTrainingSession.tsStatus = status; // Safely update the status
          }
          this.modalService.dismissAll(); // Close modal
        },
        error: err => {
          console.error('Failed to update status', err);
          this.toaster.error('Failed to update status');
        }
      });
    } else {
      this.toaster.error('Form is not valid, please select a status, or no session is selected.');
    }
  }

  sanitizeHtml(html: string | undefined): SafeHtml {
    return html ? this.sanitizer.bypassSecurityTrustHtml(html) : '';
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
  registerTrainingSession(tsId: number): void {
    const userId = this.storageService.getUser()?.id;
    if (!userId) {
      console.error('User ID not available');
      this.showSnackbar('User ID not available', 'red');
      return;
    }

    this.registrationService.registerForTraining(tsId, userId).subscribe(
      () => {
        console.log('Registration successful');
        this.showSnackbar('Registration successful', 'green');
      },
      error => {
        console.error('An error occurred:', error);
        this.showSnackbar(`Registration is already done `, 'red');
      }
    );
  }

  showSnackbar(message: string, color: string): void {
    // Create a snackbar element
    const snackbar = document.createElement('div');
    snackbar.textContent = message;

    // Apply styles for the specified color
    snackbar.style.backgroundColor = color;
    snackbar.style.color = 'white';
    snackbar.style.padding = '10px';
    snackbar.style.borderRadius = '5px';
    snackbar.style.position = 'fixed';
    snackbar.style.bottom = '20px';
    snackbar.style.left = '50%';
    snackbar.style.transform = 'translateX(-50%)';
    snackbar.style.zIndex = '9999';

    // Append snackbar to the body
    document.body.appendChild(snackbar);

    // Automatically hide the snackbar after 3 seconds
    setTimeout(() => {
      snackbar.remove();
    }, 3000);
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
        this.trainingSessions = sessions.content;
        this.filteredEvents = [...this.trainingSessions]; // Assurez-vous de cloner l'array si nécessaire
        this.totalItems = sessions.totalElements;
        this.totalActivities = Math.ceil(this.totalItems / this.pageSize); // Calcul du nombre total de pages
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading training sessions', err);
        this.toaster.error('Failed to load training sessions');
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
    if (this.currentPage < this.totalActivities - 1) {
      this.currentPage++;
      this.loadTrainingSessions(this.currentPage, this.pageSize);
    }
  }

  changePage(event: PageEvent): void {
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
      const requestData = {
        title: formData.title,
        target_audience: formData.target_audience || null,
        session_outline: formData.session_outline || null,
        expected_outcomes: formData.expected_outcomes || null,
        start_date: formData.start_date,
        finish_date: formData.finish_date,
        topic: formData.topic,
        trainerId: formData.trainer,  // Assuming 'trainer' is the ID field and correctly populated
        place: formData.placeType === 'EXTERNAL' ? 'ONLINE' : formData.place,
        capacity: formData.capacity,
        typeTS: formData.placeType === 'EXTERNAL' ? 'ONLINE' : formData.typeTS,
        tsStatus: formData.tsStatus,
        placeType: formData.placeType || null
      };

      console.log('Submitting this data to server:', requestData);

      const roomId = formData.placeType === 'INTERNAL' ? formData.room.id : null;
      const trainerId = formData.trainer; // Make sure trainerId is correctly passed from form

      if (roomId === null) {
        this.trainingSessionService.addTrainingSessionWithoutRoom(requestData, trainerId).subscribe({
          next: (response) => {
            console.log('Training session added successfully:', response);
            this.toaster.success('Training session added successfully');
            this.modalService.dismissAll();
            this.newTrainingSessionForm.reset();
            this.loadTrainingSessions(this.currentPage, this.pageSize);
          },
          error: (error) => {
            console.error('Error when trying to add session:', error);
            this.toaster.error(`Error adding training session: ${error.error?.message || 'Unknown error'}`);
          }
        });
      } else {
        this.trainingSessionService.addTrainingSessionWithRoom(requestData, roomId, trainerId).subscribe({
          next: (response) => {
            console.log('Training session added successfully with room:', response);
            this.toaster.success('Training session added successfully with room');
            this.modalService.dismissAll();
            this.newTrainingSessionForm.reset();
            this.loadTrainingSessions(this.currentPage, this.pageSize);
          },
          error: (error) => {
            console.error('Error when trying to add session with room:', error);
            this.toaster.error(`Error adding training session with room: ${error.error?.message || 'Unknown error'}`);
          }
        });
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

  //
  // updateTrainingSession(): void {
  //   if (this.updateTrainingSessionForm.valid && this.selectedTrainingSession) {
  //     const updatedSession: TrainingSession = {
  //       ...this.selectedTrainingSession,
  //       ...this.updateTrainingSessionForm.value
  //     };
  //     this.trainingSessionService.UpdateTrainingSession(updatedSession).subscribe({
  //       next: () => {
  //         this.loadTrainingSessions(this.currentPage, this.pageSize);
  //         this.modalRef?.close();
  //       },
  //       error: (err) => console.error('Error updating training session', err)
  //     });
  //   }
  // }

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


  openModal(componentOrTemplateRef: ComponentType<any> | TemplateRef<any>, config?: NgbModalOptions): NgbModalRef {
    return this.modalService.open(componentOrTemplateRef, config);
  }

}

