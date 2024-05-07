import {ChangeDetectorRef, Component, Inject, OnInit, Pipe, PipeTransform, TemplateRef, ViewChild} from '@angular/core';
import {TrainingSession} from "../../../Models/TrainingSession";
import {EventService} from "../../../Services/Event.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import {TrainingSessionService} from "../../../Services/TrainingSession.service";
import {Activity} from "../../../Models/Activity";
import {Subject} from "rxjs";
import {Event} from "../../../Models/Event";
import * as _ from 'lodash';
import {MatPaginator} from "@angular/material/paginator";
import {TS_Status} from "../../../Models/TS_Status";
import {TypeTS} from "../../../Models/TypeTS";


@Component({
  selector: 'app-training-session-b',
  templateUrl: './training-session-b.component.html',
  styleUrls: ['./training-session-b.component.css']
})


export class TrainingSessionBComponent implements OnInit  {
  trainingSessions: TrainingSession[] = [];
  showFullTextOutline: boolean[] = [];
  showFullTextOutcome: boolean[] = [];
  @ViewChild('sessionDetails') sessionDetailsTemplate!: TemplateRef<any>;
  selectedTrainingSession: TrainingSession | null = null;
  isDetailsModalOpen: boolean = false;
  searchQuery: string = '';
  searchChanged: Subject<string> = new Subject<string>();
  filteredEvents: TrainingSession[] = [];
  pageSizeOptions: number[] = [2, 10, 15, 20]; // Options de taille de page
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  constructor(private trainingSessionService: TrainingSessionService,
              private dialog: MatDialog,
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
    this.loadTrainingSessions();
  }

  loadTrainingSessions(): void {
    this.trainingSessionService.findAllRegistrationTS(this.currentPage - 1, this.pageSize).subscribe({
      next: (sessions) => {
        this.trainingSessions = sessions.content;
        this.filteredEvents = sessions.content; // Initialiser filteredEvents avec les données
        this.showFullTextOutline = new Array(sessions.content.length).fill(false);
        this.showFullTextOutcome = new Array(sessions.content.length).fill(false);
        this.totalPages = sessions.totalPages;

      },
      error: (err) => console.error('Error loading training sessions', err)
    });
  }

  toggleText(index: number, type: string): void {
    if (type === 'outline') {
      this.showFullTextOutline[index] = !this.showFullTextOutline[index];
    } else if (type === 'outcome') {
      this.showFullTextOutcome[index] = !this.showFullTextOutcome[index];
    }
  }
  openDetailsModal(session: TrainingSession): void {
    console.log('Selected training session:', session.ts_id);
    if (session.ts_id !== undefined) {
      this.trainingSessionService.getUsersByTrainingSession(session.ts_id).subscribe(
        (users) => {
          if (users && users.length > 0) {
            console.log('Registered users:', session.ts_id, users.map(user => `${user.firstname} ${user.lastname}`));
            session.users = users; // Assigning fetched users to the session object
          } else {
            console.log('No users registered for this session');
          }
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
    } else {
      console.error('Session ID is undefined');
    }
    this.selectedTrainingSession = session;
    this.isDetailsModalOpen = true;
  }



  closeDetailsModal(): void {
    this.selectedTrainingSession = null;
    this.isDetailsModalOpen = false;
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
  onPageChange(event: any): void {
    const pageIndex = event.pageIndex;
    this.loadTrainingSessions();
  }
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadTrainingSessions();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTrainingSessions();
    }
  }

  protected readonly TS_Status = TS_Status;
  protected readonly TypeTS = TypeTS;
}
