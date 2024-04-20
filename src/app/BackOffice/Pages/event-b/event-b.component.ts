import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EventService } from "src/app/Services/Event.service";
import { Event } from 'src/app/Models/Event';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Activity } from "../../../Models/Activity";
import {forkJoin, of, Subject} from "rxjs";
import {catchError, debounceTime, distinctUntilChanged, map} from "rxjs/operators";
import * as _ from 'lodash';
function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
@Component({
  selector: 'app-event-b',
  templateUrl: './event-b.component.html',
  styleUrls: ['./event-b.component.css']
})
export class EventBComponent implements OnInit {
  events: Event[] = [];
  currentPage = 0;
  pageSize = 10;
  @ViewChild('activities') activitiesElement!: ElementRef;
  @ViewChild('eventModal') eventModal!: TemplateRef<any>;
  private dialogRef!: MatDialogRef<any>;
  selectedEventActivities: Activity[] = [];
  searchQuery: string = '';
  searchChanged: Subject<string> = new Subject<string>();
  filteredEvents: Event[] = [];
  isDetailsModalOpen: boolean = false;

  constructor(
    private eventService: EventService,
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
    this.loadEvents();
  }

  closeDetailsModal(): void {
    this.isDetailsModalOpen = false; // Set the modal to close
  }

  applyFilter(): void {
    const filtered = _.deburr(this.searchQuery.toLowerCase());

    this.filteredEvents = this.events.filter(event => {
      const nameMatch = _.deburr(event.event_name.toLowerCase()).includes(filtered);
      const descriptionMatch = _.deburr(event.event_description.toLowerCase()).includes(filtered);
      const averageMatch = _.deburr(event.averageRating?.toString().toLowerCase()).includes(filtered);
      const place = _.deburr(event.place?.toString().toLowerCase()).includes(filtered);

      return nameMatch || descriptionMatch || averageMatch || place ;
    });
  }

  loadEvents(): void {
    this.eventService.findAllEvent(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.events = response.content;

        // Fetch activities for each event here
        const eventsWithActivities = this.events.map(event => {
          return this.eventService.getRelatedActivities(event.eventId).pipe(
            map(activities => {
              event.Activitys = activities; // Assign activities to the event
              return event;
            }),
            catchError(error => {
              console.error('Error fetching activities for event:', event.eventId, error);
              return of(event); // Return the event without activities in case of an error
            })
          );
        });

        // Combine all observables and assign the results back to the filteredEvents
        forkJoin(eventsWithActivities).subscribe(completeEvents => {
          this.filteredEvents = completeEvents;
          this.applyFilter(); // Apply the filter once the events and activities are loaded
          this.cdr.detectChanges(); // Trigger change detection if needed
        });
      },
      error: (error) => {
        console.error('Error loading events:', error);
      }
    });
  }
  generateReportPDF(): void {
    const pdf = new jsPDF();
    const margins = { top: 20, left: 15, bottom: 30, right: 15 };
    const lineHeight = 10;
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;

    pdf.setFont('Helvetica');

    const addHeader = (page: number) => {
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text('Event Report', margins.left, 15);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Page ${page}`, pageWidth - margins.right, 15);
      pdf.setLineWidth(0.5);
      pdf.line(margins.left, 22, pageWidth - margins.right, 22);
    };

    const addFooter = () => {
      pdf.setFontSize(10);
      pdf.text(`Report generated on: ${new Date().toLocaleDateString()}`, margins.left, pageHeight - margins.bottom / 2);
    };

    addHeader(1);
    addFooter();

    let yPosition = margins.top + 25; // Start after the header

    this.filteredEvents.forEach(event => {
      if (yPosition > pageHeight - margins.bottom) {
        pdf.addPage();
        addHeader((pdf.internal as any).getNumberOfPages());
        addFooter();
        yPosition = margins.top;
      }

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Event Name: ${event.event_name}`, margins.left, yPosition);
      yPosition += lineHeight + 2;

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Place: ${event.place ?? "N/A"}`, margins.left, yPosition);
      yPosition += lineHeight;

      pdf.text(`Date: ${formatDate(event.event_date)}`, margins.left, yPosition);
      yPosition += lineHeight;

      pdf.text(`Average Rating: ${event.averageRating ?? "N/A"}`, margins.left, yPosition);
      yPosition += lineHeight;

      pdf.text(`Description:`, margins.left, yPosition);
      yPosition += lineHeight;

      const descriptionLines = pdf.splitTextToSize(event.event_description || "N/A", pageWidth - margins.left - margins.right);
      pdf.text(descriptionLines, margins.left, yPosition);
      yPosition += (lineHeight * descriptionLines.length) + 2;

      pdf.setFont("helvetica", "bold");
      pdf.text('Activities:', margins.left, yPosition);
      yPosition += lineHeight;
      pdf.setFont("helvetica", "normal");

      const activities = event.Activitys || [];
      if (activities.length) {
        activities.forEach(activity => {
          if (yPosition > pageHeight - margins.bottom) {
            pdf.addPage();
            addHeader((pdf.internal as any).getNumberOfPages());
            addFooter();
            yPosition = margins.top;
          }
          pdf.text(`- ${activity.activity_name}: ${activity.description}`, margins.left, yPosition);
          yPosition += lineHeight;
        });
      } else {
        pdf.text('None', margins.left, yPosition);
        yPosition += lineHeight;
      }

      yPosition += lineHeight * 2; // Add extra space before next event
    });

    pdf.save('event_report.pdf');
  }



  openModal(event: Event): void {
    this.eventService.getRelatedActivities(event.eventId).subscribe({
      next: (activities) => {
        this.selectedEventActivities = activities;
        this.dialogRef = this.dialog.open(this.eventModal, {
          width: '600px',
          data: { event: event }
        });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des activités liées :', error);
      }
    });
  }

  closeModal(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}