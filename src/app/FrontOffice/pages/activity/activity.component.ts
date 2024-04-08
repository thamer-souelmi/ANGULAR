import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  NgZone,
  Renderer2,
  TemplateRef
} from '@angular/core';
import { Activity } from 'src/app/Models/Activity';
import { ActivityService } from 'src/app/Services/Activity.service';
import { Router } from '@angular/router';
import { Event } from 'src/app/Models/Event';
import {PageEvent} from '@angular/material/paginator';
import {FormBuilder, FormGroup, Validators, ValidationErrors, ValidatorFn, AbstractControl} from "@angular/forms";
import {Location} from "@angular/common";
import * as bootstrap from 'bootstrap';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

export const dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const group = control as FormGroup;
  const start = group.get('startTime')?.value;
  const end = group.get('finishTime')?.value;
  // Check if both start and end values are present before validating
  if (start && end) {
    return start < end ? null : { dateRange: true };
  }
  return null; // No error if one or both fields are empty
};
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})


export class ActivityComponentF implements OnInit {
  activities: Activity[] = [];
  activity: Activity = new Activity();
  events: Event[] = [];
  totalActivities = 0;
  currentPage = 0;
  pageSize = 9;
  totalPages = 0;
  activityForm: FormGroup;
  @ViewChild('myModal') myModal!: ElementRef;
  @ViewChild('warningSuccessModal') warningSuccessModal!: ElementRef;
  warningMessage: string = '';
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal!: ElementRef;
  private activityIdToDelete!: number;
  updateActivityForm!: FormGroup;
  @ViewChild('updateActivityModal') updateActivityModal!: ElementRef;
  selectedActivity: Activity | null = null;
  searchTerm: string = '';
  filteredActivities: Activity[] = [];
  allActivities: Activity[] = [];
  @ViewChild('updateModal') updateModal!: TemplateRef<any>;
  private modalRef!: NgbModalRef;
  readonly maxLength = 100;
  expandedDescriptions: { [key: number]: boolean } = {};
  @ViewChild('searchResultsModal') searchResultsModal!: TemplateRef<any>;

  searchKeywords: string = '';
  searchStartDate: string = '';
  searchEndDate: string = '';

  constructor(
    private activityServiceF: ActivityService,
    private router: Router ,
    private location: Location,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private modalService: NgbModal,
    private renderer: Renderer2,
  )
  {
    this.activityForm = this.formBuilder.group({
      activity_name: ['', Validators.required],
      description: ['', Validators.required],
      startTime: ['', Validators.required],
      finishTime: ['', Validators.required],
      event: ['', Validators.required]
    }, { validators: dateRangeValidator });
    this.updateActivityForm = this.formBuilder.group({
      activity_name: ['', Validators.required],
      description: ['', Validators.required],
      startTime: ['', Validators.required],
      finishTime: ['', Validators.required],
      event: ['', Validators.required]
    }, { validators: dateRangeValidator });
  }
  ngOnInit(): void {
    this.loadActivitiesFront(this.currentPage, this.pageSize);
    this.loadEvents();
    // this.initializeForms();

  }
  shouldShowDateRangeError(): boolean {
    const form = this.activityForm;
    const startTimeFilled = !!form.get('startTime')?.value;
    const finishTimeFilled = !!form.get('finishTime')?.value;
    const hasDateRangeError = !!form.errors?.['dateRange'];

    return startTimeFilled && finishTimeFilled && hasDateRangeError;
  }
  toggleDescription(activityId: number): void {
    this.expandedDescriptions[activityId] = !this.expandedDescriptions[activityId];
  }

  isDescriptionTooLong(description: string): boolean {
    return description.length > this.maxLength;
  }

  showModalWithMessage(message: string): void {
    this.warningMessage = message;
    const modalInstance = new bootstrap.Modal(this.warningSuccessModal.nativeElement);
    modalInstance.show();
  }
  searchActivities() {
    this.activityServiceF.searchActivities(this.searchKeywords, this.searchStartDate, this.searchEndDate)
      .subscribe({
        next: (activities) => {
          this.activities = activities;
          console.log('Activités trouvées:', activities);
          this.openModal();
        },
        error: (error) => console.error('Erreur lors de la recherche d\'activités:', error)
      });
  }
  openAdvancedSearchModal(content: any) {
    this.modalService.open(content, { centered: true });
  }
  openModal() {
    const modalRef = this.modalService.open(this.searchResultsModal, { size: 'lg' });
  }

  openUpdateModal(activity: Activity): void {
    this.selectedActivity = activity;
    this.updateActivityForm.patchValue(activity);
    this.modalRef = this.modalService.open(this.updateModal);
  }


  formatDate(date: Date | string): string {
    const d = new Date(date);
    const pad = (num: number) => num < 10 ? '0' + num : num;
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }


  showModal(modalElementRef: ElementRef): void {
    const modalElement = modalElementRef.nativeElement;
    modalElement.addEventListener('shown.bs.modal', () => console.log('Modal is shown'));
    modalElement.addEventListener('hidden.bs.modal', () => console.log('Modal is hidden'));

    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }

  askDeleteConfirmation(activityId: number): void {
    this.activityIdToDelete = activityId;
    const modal = new bootstrap.Modal(this.deleteConfirmationModal.nativeElement);
    modal.show();
  }
  confirmDeletion(): void {
    this.activityServiceF.deleteActivity(this.activityIdToDelete).subscribe({
      next: () => {
        this.showModalWithMessage('Activity deleted successfully!');
        this.loadActivitiesFront(this.currentPage, this.pageSize); // Refresh the activities list
      },
      error: () => {
        this.showModalWithMessage('Error deleting the activity. Please try again.');
      }
    });

    const modalInstance = bootstrap.Modal.getInstance(this.deleteConfirmationModal.nativeElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }


  loadActivitiesFront(pageIndex: number, pageSize: number): void {
    this.activityServiceF.findAllActivities(pageIndex, pageSize).subscribe(response => {
      const now = new Date();
      this.allActivities = response.content.filter((activity: Activity) => new Date(activity.finishTime) > now);
      this.filteredActivities = [...this.allActivities]; // Set filteredActivities to allActivities initially
      this.totalActivities = this.filteredActivities.length;
      this.totalPages = response.totalPages || Math.ceil(this.totalActivities / this.pageSize);
      this.cdr.detectChanges();
    }, error => {
      console.error('Error fetching activities:', error);
    });
  }


  filterActivities(): void {
    if (!this.searchTerm) {
      this.filteredActivities = [...this.allActivities]; // Reset to the full list
    } else {
      this.filteredActivities = this.allActivities.filter(activity =>
        activity.activity_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  nextPage(): void {
    if (this.currentPage < (this.totalActivities / this.pageSize) - 1) {
      this.currentPage++;
      this.loadActivitiesFront(this.currentPage, this.pageSize);
    }
  }
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadActivitiesFront(this.currentPage, this.pageSize);
    }
  }
  loadEvents(): void {
    this.activityServiceF.getAllEventsWithName().subscribe(
      events => {
        this.events = events;
        console.log('Events:', this.events);
      },
      error => {
        console.error('Error fetching events:', error);
      }
    );
  }


  changePage(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadActivitiesFront(this.currentPage, this.pageSize);
  }

  goBack() {
    this.location.back();
  }
  updateActivity(activity_id: number): void {
    this.router.navigate([`/ActivityF/updateActivityF/${activity_id}`]);
  }

  // deleteActivity(activity_id : number): void {
  //   console.log('Activity ID:', activity_id );
  //   if (confirm('Are you sure you want to delete this activity?')) {
  //     this.activityServiceF.deleteActivity(activity_id ).subscribe(
  //       () => {
  //         console.log('Activity deleted successfully.');
  //         alert('Activity deleted successfully.');
  //         this.loadActivitiesFront(this.currentPage, this.pageSize);
  //       },
  //       error => {
  //         console.error('Error deleting activity:', error);
  //       }
  //     );
  //   }
  // }



  getEventName(activity: Activity): string {
    return activity.event ? activity.event.event_name : 'No Event';
  }
  get formErrors() {
    return this.activityForm.errors || {};
  }
  showUpdateModal(activity: Activity): void {
    this.selectedActivity = activity;
    this.updateActivityForm.patchValue({
      activity_id: activity.activity_id,
      activity_name: activity.activity_name,
      description: activity.description,
      startTime: activity.startTime,
      finishTime: activity.finishTime,
      event: activity.event.eventId
    });
    // Assuming you have a reference to the modal element
    const modal = new bootstrap.Modal(this.updateActivityModal.nativeElement);
    modal.show();
  }
  onSubmit() {
    if (this.activityForm.valid) {
      const activity: Activity = this.activityForm.value;

      if (activity.event && activity.event.eventId) {
        console.log('Activity to add:', activity);
        this.showModalWithMessage('Activity added successfully!');

        this.activityServiceF.addActivity(activity, activity.event.eventId).subscribe(
          (addedActivity: Activity) => {
            console.log('Activity added successfully:', addedActivity);
            this.activityForm.reset();
            this.loadActivitiesFront(this.currentPage, this.pageSize);
            this.cdr.detectChanges();

            // this.router.navigate(['/ActivityF/allactivitiesF']);
          },
          error => {
            console.error('Error adding activity:', error);
            this.showModalWithMessage('Error adding activity. Please try again.');

          }
        );
      }else if (this.activityForm.valid){
        const updatedActivity = new Activity();
        const formValues = this.activityForm.value;
        updatedActivity.activity_id = this.activity.activity_id;
        updatedActivity.activity_name = formValues.activity_name;
        updatedActivity.description = formValues.description;
        updatedActivity.startTime = new Date(formValues.startTime);
        updatedActivity.finishTime = new Date(formValues.finishTime);
        updatedActivity.event = { eventId: formValues.event } as Event;

        this.activityServiceF.updateActivity(updatedActivity, formValues.event).subscribe(
          () => {
            alert('Activity updated successfully.');
            this.router.navigate(['/ActivityF/getActivityF']);
          });
      } else {
        console.error('Event ID is missing in the activity form.');
      }
    }
  }
  onSubmitUpdate(): void {
    if (this.updateActivityForm.valid && this.selectedActivity) {
      const formValues = this.updateActivityForm.value;
      const eventId = typeof formValues.event === 'object' ? formValues.event.eventId : formValues.event;

      const updatedActivity = {
        ...formValues,
        activity_id: this.selectedActivity.activity_id
      };

      this.activityServiceF.updateActivity(updatedActivity, eventId).subscribe({
        next: () => {
          // Fermez le modal de mise à jour en utilisant la référence conservée
          if (this.modalRef) {
            this.modalRef.close();
          }

          // Rechargez les activités et affichez le message de succès
          this.loadActivitiesFront(this.currentPage, this.pageSize);
          this.showModalWithMessage('Activity updated successfully!');
        },
        error: (error) => {
          console.error('Error updating activity', error);
          this.showModalWithMessage('Error updating activity. Please try again.');
        }
      });
    } else {
      console.error('Update form is invalid:', this.updateActivityForm.errors);
    }
  }



  closeModal(modalElementRef: ElementRef): void {
    const modalInstance = bootstrap.Modal.getInstance(modalElementRef.nativeElement);
    modalInstance?.hide();
  }
}
