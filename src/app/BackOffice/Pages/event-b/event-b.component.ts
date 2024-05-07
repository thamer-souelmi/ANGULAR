import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EventService } from "src/app/Services/Event.service";
import { Event } from 'src/app/Models/Event';
import { jsPDF } from "jspdf";
import * as L from 'leaflet';
import html2canvas from 'html2canvas';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Activity } from "src/app/Models/Activity";
import { forkJoin, Observable, of, Subject } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import * as _ from 'lodash';
import { icon, Marker } from "leaflet";
import { formatDate } from "@fullcalendar/core";
import {User} from "../../../Models/User";
function removeEmojis(text: string): string {
  // This regex matches most common emojis
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  return text.replace(emojiRegex, '');
}
@Component({
  selector: 'app-event-b',
  templateUrl: './event-b.component.html',
  styleUrls: ['./event-b.component.css']
})
export class EventBComponent implements OnInit {
  events: Event[] = [];
  currentPage = 1;
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
  page: number = 0;
  size: number = 5;
  loading: boolean = false;
  totalPages = 5;
  totalItems: number = 0;
  feedbackData!: number[];
  registeredUsers: User[] = [];

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
    this.feedbackData = [10, 5, 3]; // Exemple de données des feedbacks (positifs, neutres, négatifs)

  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadEvents();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadEvents();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEvents();
    }
  }

  closeDetailsModal(): void {
    this.isDetailsModalOpen = false;
  }

  applyFilter(): void {
    const filtered = _.deburr(this.searchQuery.toLowerCase());
    this.filteredEvents = this.events.filter(event => {
      const nameMatch = _.deburr(event.event_name.toLowerCase()).includes(filtered);
      const descriptionMatch = _.deburr(event.event_description.toLowerCase()).includes(filtered);
      const averageMatch = _.deburr(event.averageRating?.toString().toLowerCase()).includes(filtered);
      const placeMatch = _.deburr(event.place?.toString().toLowerCase()).includes(filtered);
      return nameMatch || descriptionMatch || averageMatch || placeMatch;
    });
  }

  loadEvents(): void {
    this.eventService.findAllEvent(this.currentPage - 1, this.size).subscribe({
      next: (response) => {
        this.events = response.content;
        this.totalItems = response.totalElements;
        this.totalPages = Math.ceil(this.totalItems / this.size);
        this.filteredEvents = this.events;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading events:', error)
    });
  }

  generateReportForEvent(event: Event): void {
    this.eventService.getRelatedActivities(event.eventId).subscribe({
      next: (activities) => {
        event.Activitys = activities;
        this.generateReportPDF(event);
      },
      error: (error) => {
        console.error('Error fetching activities:', error);
        this.generateReportPDF(event);
      }
    });
  }

  async generateReportPDF(selectedEvent: Event): Promise<void> {
    const pdf = new jsPDF();
    const margins = { top: 30, left: 20, bottom: 30, right: 20 };
    const lineHeight = 10;
    const pageHeight = pdf.internal.pageSize.height;

    const addHeader = (page: number) => {
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Event Report', margins.left, 20);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Page ${page}`, pdf.internal.pageSize.width - margins.right, 20, { align: 'right' });
      pdf.setDrawColor(0, 0, 255);
      pdf.setLineWidth(0.5);
      pdf.line(margins.left, 25, pdf.internal.pageSize.width - margins.right, 25);
    };

    const addFooter = () => {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text(`Report generated on: ${new Date().toLocaleDateString()}`, margins.left, pageHeight - margins.bottom / 2);
    };

    addHeader(1);
    addFooter();
    const eventName = removeEmojis(selectedEvent.event_name ?? "N/A");
    const eventDescription = removeEmojis(selectedEvent.event_description ?? "N/A");
    let yPosition = 35;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Name: ${selectedEvent.event_name ?? "N/A"}`, margins.left, yPosition);
    yPosition += lineHeight;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Date: ${formatDate(selectedEvent.event_date)}`, margins.left, yPosition);
    yPosition += lineHeight;

    pdf.text(`Average Rating: ${selectedEvent.averageRating ?? "N/A"}`, margins.left, yPosition);
    yPosition += lineHeight;

    pdf.text(`Description: ${eventDescription}`, margins.left, yPosition);
    yPosition += lineHeight;

    const placeLines = this.splitTextIntoLines(`Place: ${selectedEvent.place ?? "N/A"}`, 100);
    placeLines.forEach(line => {
      pdf.text(line, margins.left, yPosition);
      yPosition += lineHeight;
    });

    if (selectedEvent.latitude && selectedEvent.longitude) {
      const imageBase64 = await this.getMapImageAsBase64(selectedEvent.latitude, selectedEvent.longitude);
      if (yPosition + 160 > pageHeight - margins.bottom) {
        pdf.addPage();
        addHeader(pdf.getNumberOfPages());
        addFooter();
        yPosition = margins.top;
      }
      pdf.addImage(imageBase64, 'JPEG', margins.left, yPosition, 180, 160);
      yPosition += 170;
    }

    selectedEvent.Activitys?.forEach((activity, index) => {
      if (yPosition + lineHeight > pageHeight - margins.bottom) {
        pdf.addPage();
        addHeader(pdf.getNumberOfPages());
        addFooter();
        yPosition = margins.top;
      }

      // Add a line before each activity except the first one
      if (index > 0) {
        pdf.setDrawColor(0, 0, 0); // Set color to black for the line
        pdf.setLineWidth(0.1);
        pdf.line(margins.left, yPosition - 5, pdf.internal.pageSize.width - margins.right, yPosition - 5); // Draw line above the activity
        yPosition += 5; // Add some space after the line
      }

      // Print activity name
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Activity Name:', margins.left, yPosition);
      yPosition += lineHeight;

      pdf.setFont('helvetica', 'normal');
      pdf.text(activity.activity_name, margins.left, yPosition);
      yPosition += lineHeight;

      // Process and print the description
      const eventDescription = removeEmojis(activity.description ?? "N/A");
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Description:', margins.left, yPosition);
      yPosition += lineHeight;
      pdf.setFont('helvetica', 'normal');

      const placeLines = this.splitTextIntoLines(eventDescription, 100);
      placeLines.forEach(line => {
        pdf.text(line, margins.left, yPosition);
        yPosition += lineHeight;
      });

      // Add extra space after each activity for better separation
      yPosition += 10; // Adjust this value based on desired spacing
    });



    pdf.save('event_report.pdf');
  }


  splitTextIntoLines(text: string, maxLength: number): string[] {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + word).length > maxLength) {
        lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine += ` ${word}`;
      }
    });

    if (currentLine) {
      lines.push(currentLine.trim());
    }

    return lines;
  }

  async getMapImageAsBase64(lat: number, lng: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const mapEl = document.createElement('div');
      document.body.appendChild(mapEl);
      mapEl.style.position = 'absolute';
      mapEl.style.left = '-9999px';
      mapEl.style.height = '600px';
      mapEl.style.width = '600px';

      const map = L.map(mapEl, {
        center: [lat, lng],
        zoom: 16,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

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
            document.body.removeChild(mapEl);
          });
        }, 2000);
      });
    });
  }

  private getLeafletDefaultIcon(): L.Icon {
    return L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      shadowSize: [41, 41]
    });
  }

  openModal(event: Event): void {
    this.eventService.getRelatedActivities(event.eventId).subscribe({
      next: (activities) => {
        this.selectedEventActivities = activities;
        this.eventService.getEventUsers(event.eventId).subscribe({
          next: (users) => {
            console.log("Users data:", JSON.stringify(users)); // Log to inspect structure
            this.registeredUsers = users;
            this.dialogRef = this.dialog.open(this.eventModal, {
              width: '600px',
              data: { event: event, users: this.registeredUsers }
            });
          },
          error: (error) => console.error('Error retrieving users:', error)
        });
      },
      error: (error) => console.error('Error retrieving activities:', error)
    });
  }

  updateUserStatus(eventId: number, userId: number, status: string): void {
    if (typeof userId === 'undefined') {
      console.error("User ID is undefined, cannot update status.");
      return;
    }
    this.eventService.updateRegistrationStatus(eventId, userId, status).subscribe({
      next: () => {
        console.log('Status updated successfully');
        this.dialogRef.close();
        this.loadEvents();
      },
      error: (error) => {
        console.error('Error updating status:', error);
        alert('Failed to update status. Please try again.');
      }
    });
  }

  closeModal(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
