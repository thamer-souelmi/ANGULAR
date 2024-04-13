import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { EventService } from "src/app/Services/Event.service";
import { Event } from 'src/app/Models/Event';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
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

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.findAllEvent(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.events = response.content;
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      }
    });
  }
  generatePDF() {
    if (this.activitiesElement && this.activitiesElement.nativeElement) {
      html2canvas(this.activitiesElement.nativeElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: "landscape",
        });
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('activities.pdf');
      });
    } else {
      console.error('Activities element not found!');
    }
  }
}
