import { Component, OnInit } from '@angular/core';
import { EventService } from "src/app/Services/Event.service";
import { Event } from 'src/app/Models/Event';

@Component({
  selector: 'app-event-b',
  templateUrl: './event-b.component.html',
  styleUrls: ['./event-b.component.css']
})
export class EventBComponent implements OnInit {
  events: Event[] = [];
  currentPage = 0;
  pageSize = 10;

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
}
