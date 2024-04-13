import {ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { Activity } from "src/app/Models/Activity";
import { ActivityService } from "src/app/Services/Activity.service";
import { EventService } from "src/app/Services/Event.service";
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog } from "@angular/material/dialog";
import * as _ from 'lodash';
import { Event } from "src/app/Models/Event";

@Component({
  selector: 'app-activity-b',
  templateUrl: './activity-b.component.html',
  styleUrls: ['./activity-b.component.css']
})
export class ActivityBComponent implements OnInit {
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  totalActivities = 0;
  currentPage = 0;
  pageSize = 10;
  searchQuery = '';
  searchChanged: Subject<string> = new Subject<string>();
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedEventId: number | null = null;
  allEvents: Event[] = [];
  isModalOpen: boolean = false;
  isResultsModalOpen = false;
  searchResults: any[] = [];
  @ViewChild('filterModal') filterModal!: TemplateRef<any>;
  @ViewChild('resultsModal') resultsModal!: TemplateRef<any>;
  filterModalRef: any; // Reference for the filter modal
  selectedActivity: Activity | null = null;
  @ViewChild('detailsModal') detailsModal!: TemplateRef<any>;
  isDetailsModalOpen: boolean = false;
  constructor(
    private activityService: ActivityService,
    private eventService: EventService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.searchChanged.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(model => {
      this.searchQuery = model;
      this.applyFilter();
    });
  }

  ngOnInit(): void {
    this.loadActivities();
    this.loadEvents();
    this.isResultsModalOpen = false; // Pour empêcher l'ouverture automatique du modal de résultats
  }
  openDetailsModal(activity: Activity): void {
    this.selectedActivity = activity;
    this.isDetailsModalOpen = true;
    this.cdr.detectChanges(); // Trigger change detection manually
  }

  closeDetailsModal(): void {
    this.selectedActivity = null;
    this.isDetailsModalOpen = false; // Set the modal to close
  }

  applyFilter(): void {
    let filtered = _.deburr(this.searchQuery.toLowerCase());

    this.filteredActivities = this.activities.filter(activity => {
      const nameMatch = _.deburr(activity.activity_name.toLowerCase()).includes(filtered);
      const descriptionMatch = _.deburr(activity.description.toLowerCase()).includes(filtered);
      const dateMatch = this.filterByDate(activity.startTime, activity.finishTime);
      return (nameMatch || descriptionMatch) && dateMatch;
    });

    if (this.filterModalRef) {
      this.filterModalRef.close();
    }

    this.openResultsModal(); // Ouvrir le modal de résultats ici
  }

  filterByDate(startTime: Date, endTime: Date): boolean {
    if (this.startDate && this.endDate) {
      return startTime >= this.startDate && endTime <= this.endDate;
    }
    return true; // Si aucune date n'est définie, ne pas filtrer sur les dates
  }


  openResultsModal(): void {
    this.isResultsModalOpen = true;
  }


  onSearchQueryChanged(value: string): void {
    this.searchChanged.next(value);
  }



  loadActivities(): void {
    this.activityService.findAllActivities(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.activities = data.content;
        this.totalActivities = data.totalElements;
        this.applyFilter(); // Reapply the filter to update the list
      },
      error: (error) => {
        console.error('Error loading activities:', error);
      }
    });
  }

  loadEvents(): void {
    this.eventService.findAllEvent(this.currentPage, this.pageSize).subscribe(response => {
      console.log('Events from DB:', response.content); // Log the received events
      this.allEvents = response.content; // Assign the events from the 'content' array to 'allEvents'
    }, (error: unknown) => {
      console.error('Error loading events:', error);
    });
  }
}

