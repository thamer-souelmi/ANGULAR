import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EventService } from "src/app/Services/Event.service";
import { Event } from 'src/app/Models/Event';
import { jsPDF } from "jspdf";
import * as L from 'leaflet';

import html2canvas from 'html2canvas';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Activity } from "src/app/Models/Activity";
import {forkJoin, of, Subject} from "rxjs";
import {catchError, debounceTime, distinctUntilChanged, map} from "rxjs/operators";
import * as _ from 'lodash';
import {icon, Marker} from "leaflet";

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
  @ViewChild('map') mapContainer!: ElementRef;
  map!: L.Map;

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

  async generateReportPDF(): Promise<void> {
    const pdf = new jsPDF();
    const margins = { top: 30, left: 20, bottom: 30, right: 20 };
    const lineHeight = 6;
    const pageHeight = pdf.internal.pageSize.height;

    const addHeader = (page: number) => {
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Event Report', margins.left, 20);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Page ${page}`, pdf.internal.pageSize.width - margins.right, 20, { align: 'right' });
      pdf.setDrawColor(0, 0, 255); // Optional: Blue line for a bit of color
      pdf.setLineWidth(0.5);
      pdf.line(margins.left, 25, pdf.internal.pageSize.width - margins.right, 25);
    };

    const addFooter = () => {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text(`Report generated on: ${new Date().toLocaleDateString()}`, margins.left, pageHeight - margins.bottom / 2);
    };

    // Initialize header and footer
    addHeader(1);
    addFooter();

    // Y position tracker
    let yPosition = 28; // Start after the header

    // Loop through each event
    for (const event of this.filteredEvents) {
      if (yPosition + lineHeight * 7 > pageHeight - margins.bottom) { // Check for space before adding new event details
        pdf.addPage();
        addHeader(pdf.getNumberOfPages());
        addFooter();
        yPosition = margins.top;
      }

      // Event Name
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Name: ${event.event_name ?? "N/A"}`, margins.left, yPosition);
      yPosition += lineHeight;

      // Event Date
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Date: ${formatDate(event.event_date)}`, margins.left, yPosition);
      yPosition += lineHeight;

      // Event Average Rating
      pdf.text(`Average Rating: ${event.averageRating ?? "N/A"}`, margins.left, yPosition);
      yPosition += lineHeight;

      // Event Description
      pdf.text(`Description: ${event.event_description || "N/A"}`, margins.left, yPosition);
      yPosition += lineHeight;

      // Event Place
      const placeLines = this.splitTextIntoLines(` Place : ${event.place ?? "N/A"}`, 50); // Adjust the maximum line length as needed

      // Add each line of the address to the PDF
      placeLines.forEach((line, index) => {
        pdf.text(` ${line}`, margins.left, yPosition + index * lineHeight);
      });
      yPosition += placeLines.length * lineHeight; // Adjust the increment based on the number of lines added

      // Check if we need to add a map image
      if (event.latitude && event.longitude) {
        try {
          const imageBase64 = await this.getMapImageAsBase64(event.latitude, event.longitude);
          if (yPosition + 50 > pageHeight - margins.bottom) { // Check for space before adding image
            pdf.addPage();
            addHeader(pdf.getNumberOfPages());
            addFooter();
            yPosition = margins.top;
          }
          // Add map image
          pdf.addImage(imageBase64, 'JPEG', margins.left, yPosition, 180, 160); // Add map dimensions
          yPosition += 165; // Space after the map image
        } catch (error) {
          console.error('Error loading map image:', error);
        }
      }

      // Event Activities
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Activities:', margins.left, yPosition);
      pdf.setFont('helvetica', 'normal');
      yPosition += lineHeight;

      const activities = event.Activitys || [];
      for (const activity of activities) {
        if (yPosition + lineHeight > pageHeight - margins.bottom) {
          pdf.addPage();
          addHeader(pdf.getNumberOfPages());
          addFooter();
          yPosition = margins.top;
        }
        pdf.text(`- ${activity.activity_name}: ${activity.description}`, margins.left, yPosition);
        yPosition += lineHeight;
      }

      yPosition += lineHeight; // Extra space after activities
    }

    // Save the PDF
    pdf.save('event_report.pdf');
  }

  splitTextIntoLines(text: string, maxLength: number): string[] {
    const lines = [];
    let currentLine = '';

    for (const word of text.split(' ')) {
      if (currentLine.length + word.length <= maxLength) {
        currentLine += (currentLine.length === 0 ? '' : ' ') + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    return lines;
  }

  async getMapImageAsBase64(lat: number, lng: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const mapEl = document.createElement('div');
      document.body.appendChild(mapEl);
      mapEl.style.position = 'absolute';
      mapEl.style.left = '-9999px'; // Position off-screen
      mapEl.style.height = '600px'; // Desired map size
      mapEl.style.width = '600px'; // Desired map size

      // Initialize the map
      const map = L.map(mapEl, {
        center: [lat, lng],
        zoom: 16,  // Ajusté pour un meilleur focus
        attributionControl: false
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // This ensures the map sets the view and zoom correctly before placing the marker
      map.whenReady(() => {
        setTimeout(() => {
          const marker = L.marker([lat, lng], { icon: this.getLeafletDefaultIcon() }).addTo(map);

          html2canvas(mapEl, {
            useCORS: true,
            logging: true,
            scale: 1
          }).then(canvas => {
            const dataUrl = canvas.toDataURL('image/png');
            resolve(dataUrl);
          }).catch(error => {
            console.error('Error capturing map image:', error);
            reject(error);
          }).finally(() => {
            map.remove();
            document.body.removeChild(mapEl); // Clean up the DOM
          });
        }, 2000); // Augmenté le délai pour assurer la stabilité du rendu
      });
    });
  }


  private getLeafletDefaultIcon(): L.Icon {
    return L.icon({
      iconUrl: 'leaflet/dist/images/marker-icon.png', // Path to Leaflet's default marker icon
      iconSize: [25, 41], // Size of the icon
      iconAnchor: [12, 41], // Point where the icon corresponds to the marker's location
      popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
      shadowUrl: 'leaflet/dist/images/marker-shadow.png', // Path to Leaflet's default marker shadow
      shadowSize: [41, 41] // Size of the shadow
    });
  }


  private addMarkerWithDivIcon(latitude: number, longitude: number): void {
    if (!this.map) {
      console.error('Map instance is not initialized.');
      return;
    }

    const customIcon = this.getLeafletDefaultIcon();
    L.marker([latitude, longitude], { icon: customIcon }).addTo(this.map);

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
