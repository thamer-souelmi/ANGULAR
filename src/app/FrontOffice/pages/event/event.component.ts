import {
  ChangeDetectorRef,
  Component,
  AfterViewInit,
  ElementRef,
  OnInit,
  ViewChild,
  TemplateRef,
  Input
} from '@angular/core';
import { Event } from 'src/app/Models/Event';
import { EventService } from 'src/app/Services/Event.service';
import {ActivatedRoute, Router} from '@angular/router';
import { User } from 'src/app/Models/User';
import { Activity } from 'src/app/Models/Activity';
import { RegistrationEvent } from 'src/app/Models/RegistrationEvent';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import * as bootstrap from "bootstrap";
import {Location} from "@angular/common";
import {PageEvent} from "@angular/material/paginator";
import * as L from 'leaflet';
import {HttpClient} from "@angular/common/http";
import dayGridPlugin from "@fullcalendar/daygrid";
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FullCalendarComponent} from "@fullcalendar/angular";
import interactionPlugin from "@fullcalendar/interaction";
import {FeedBackService} from "src/app/Services/FeedBack.service";
import {FeedBack} from "src/app/Models/FeedBack";
import { EventColor } from 'calendar-utils';
import {CalendarEvent, CalendarView} from "angular-calendar";
import {RegistrationEventService} from "../../../Services/RegistrationEvent.service";
import {EmailService} from "../../../Services/email.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Icon, Marker} from "leaflet";
// import bootstrapPlugin from '@fullcalendar/bootstrap';

const colors: Record<string, EventColor> = {
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
};

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit,AfterViewInit {
  events: Event[] = [];
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  eventsCalender: CalendarEvent<{ event: Event }>[] = [];
  activeDayIsOpen: boolean = true;
  viewDate: Date = new Date();
  newEvent: Event = new Event();
  newEventForm: FormGroup;
  warningMessage: string = '';
  @ViewChild('warningSuccessModal') warningSuccessModal!: ElementRef;
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal!: ElementRef;
  private eventIdToDelete!: number;
  @ViewChild('updateEventModal') updateEventModal!: ElementRef;
  selectedEvent?: Event;
  updateEventForm: FormGroup;
  eventId!: number;
  event!: Event;
  totalItems = 0;
  currentPage = 0;
  pageSize = 6;
  searchTerm: string = '';
  searchControl = new FormControl('');
  allEvents: any[] = [];
  @ViewChild('addEventModal') addEventModal!: ElementRef;
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  latitude: number;
  longitude: number;
  locationQuery: string = '';
  @ViewChild('mapModal')
  mapModal!: ElementRef;
  private marker: L.Marker | undefined;
  @ViewChild('updateMapContainer') updateMapContainer!: ElementRef;
  private updateMap: L.Map | null = null;
  calendarPlugins = [dayGridPlugin];
  calendarEvents: any[] = [];
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  calendarOptions: any ;
  //   = {
  //   plugins: [dayGridPlugin, interactionPlugin],
  //   initialView: 'dayGridMonth',
  //   events: [],
  //   dateClick: this.handleDateClick.bind(this),
  // };
  selectedEventDetails?: Event;
  locationSuggestions: any[] = [];
  @ViewChild('eventDetailsTemplate') eventDetailsTemplate!: TemplateRef<any>;
  @ViewChild('feedbackModal') feedbackModal!: TemplateRef<any>;
  modalRef: NgbModalRef | undefined;
  feedbackModalRef: NgbModalRef | undefined;
  feedbackText: string = '';
  selectedEventId!: number ;
  feedbacks: FeedBack[] = [];
  feedbackNote: number = 0;
  expandedDescriptions: { [eventId: number]: boolean } = {};
  private modalHasBeenShown: boolean = false;
  @ViewChild('eventDetailsModal') eventDetailsModal!: NgbModalRef;
  calendarModalRef: NgbModalRef | undefined;
  @ViewChild('calendarModal') calendarModal: any;
  @ViewChild('addMapContainer') addMapContainer!: ElementRef;
  private addMap!: L.Map;
  averageRating?: number;
  @Input() selectedEventDetailsMaps: any;
  @ViewChild('mapDetailContainer') mapDetailContainer!: ElementRef;
  private badWords = ['badword1', 'badword2', 'badword3'];
  expandedFeedbacks: { [eventId: number]: boolean } = {};
  private mapTimeout: any;
  errorMessage: string = '';
  private map: L.Map | null = null;
  static userId: number = 1; // Assuming a default user ID
  constructor(
    private modalService: NgbModal,
    private eventService: EventService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private location: Location,
    private http: HttpClient,
    private feedbackService: FeedBackService,
    private RegistrationEventService :RegistrationEventService,
    private EmailService: EmailService,
    private snackBar: MatSnackBar

  ) {
    this.latitude = 0;
    this.longitude = 0;
    this.newEventForm = this.formBuilder.group({
      event_name: ['', Validators.required],
      event_date: ['', Validators.required],
      place: [''],
      event_description: ['', Validators.required],
      latitude: [''],
      longitude: [''],
    });
    this.updateEventForm = this.formBuilder.group({
      event_name: ['', Validators.required],
      event_date: ['', Validators.required],
      event_description: [''],
      place: ['', Validators.required],
      latitude: [''],
      longitude: [''],
    });

    this.calendarOptions = {
      events: this.events.map(event => ({
        title: event.event_name,
        start: event.event_date,
        color: colors['blue'],
        extendedProps: {
          eventId: event.eventId // Assurez-vous que cela correspond à votre modèle de données
        }
      })),
      eventClick: this.handleEventClick.bind(this),
      // Autres options...
    };

  }

  ngAfterViewInit(): void {
    // Ensure the ViewChild references are defined
    if (this.mapModal) {
      const modalElement = this.mapModal.nativeElement;

      // Listen for the 'shown.bs.modal' event without jQuery
      modalElement.addEventListener('shown.bs.modal', () => {
        this.initMap();
        this.adjustCalendar();
      });
    }
    if (this.eventDetailsModal) {
      this.eventDetailsModal.shown.subscribe(() => {
        if (this.selectedEventDetails) {
          this.initDetailMap(this.selectedEventDetails.latitude, this.selectedEventDetails.longitude);
        }
      });
    }
  }
  private addMarker(lat: number, lng: number): void {
    if (!this.map) {
      console.error('Map instance is not initialized.');
      return;
    }

    const customIcon = this.getCustomIcon();
    L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
  }


  getCustomMarker() {
    return L.divIcon({
      className: 'custom-marker',
      html: '<div class="custom-marker-shadow"></div>',
      iconSize: [12, 12], // Size of the icon
      iconAnchor: [6, 6] // Anchor point relative to icon size
    });
  }
  adjustCalendar(): void {
    if (this.calendarComponent && this.calendarComponent.getApi()) {
      this.calendarComponent.getApi().updateSize(); // Assurez-vous que cette méthode existe dans la version de FullCalendar que vous utilisez
    }
  }

  toggleFeedbacks(eventId: number): void {
    if (!this.expandedFeedbacks[eventId]) {
      this.expandedFeedbacks[eventId] = true;
    } else {
      this.expandedFeedbacks[eventId] = !this.expandedFeedbacks[eventId];
    }
  }
  private initAddMap(): void {
    if (this.addMapContainer && this.addMapContainer.nativeElement) {
      // Assurer que le conteneur de la carte est vide avant d'ajouter une nouvelle carte
      if (this.addMap) {
        this.addMap.off();
        this.addMap.remove();
      }
      // Initialiser la carte
      this.addMap = L.map(this.addMapContainer.nativeElement).setView([51.505, -0.09], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.addMap);

      // S'assurer que la taille de la carte est ajustée au conteneur
      this.addMap.invalidateSize();
    }
  }
  adjustCalendarOnModalShow() {
    const calendarApi = this.calendarComponent.getApi();
    if (calendarApi) {
      setTimeout(() => calendarApi.updateSize(), 150); // Un léger délai assure que le modal est complètement affiché
    }
  }
  // registerEvent(eventId: number): void {
  //   if (EventComponent.userId) {
  //     this.RegistrationEventService.registerForEvent(eventId, EventComponent.userId)
  //       .subscribe({
  //         next: (response) => {
  //           console.log('Registration successful:', response.message);
  //           this.EmailService.sendConfirmationEmail(EventComponent.userId, eventId).subscribe({
  //             next: (emailResponse) => {
  //               console.log('Email sent successfully:', emailResponse.message);
  //               this.showModalWithMessage("Registration and email confirmation sent successfully!");
  //             },
  //             error: (emailError) => {
  //               console.error('Failed to send email:', emailError.error.message);
  //               this.showModalWithMessage("Registration successful but failed to send confirmation email.");
  //             }
  //           });
  //         },
  //         error: (error) => {
  //           if (error.status === 409) {
  //             console.log('User is already registered for this event:', error.error.message);
  //             this.showModalWithMessage(error.error.message || "User is already registered for this event");
  //           }
  //         }
  //       });
  //   } else {
  //     console.error('User ID not available');
  //     this.showModalWithMessage("User ID not available");
  //   }

  // registerEvent(eventId: number): void {
  //   if (EventComponent.userId) {
  //     this.RegistrationEventService.registerForEvent(eventId, EventComponent.userId)
  //       .subscribe(
  //         () => {
  //           // Handle successful registration
  //           console.log('Registration successful');
  //           this.showModalWithMessage("Registration successful") ;
  //
  //         },
  //         error => {
  //           if (error.status === 409) {
  //             // User is already registered for the event
  //             console.log('User is already registered for this event');
  //             this.showModalWithMessage("User is already registered for this event") ;
  //           } else {
  //             // Handle other errors
  //             console.error('An error occurred:', error);
  //           }
  //         }
  //       );
  //   } else {
  //     console.error('User ID not available');
  //     this.showModalWithMessage("User ID not available") ;
  //   }
  //
  // }
  //
  //
  // registerEvent(eventId: number): void {
  //   if (EventComponent.userId) {
  //     this.RegistrationEventService.registerForEvent(eventId, EventComponent.userId).subscribe(
  //       () => {
  //         // Handle successful registration
  //         console.log('Registration successful');
  //         this.showSnackbar('Registration successful');
  //       },
  //       error => {
  //         if (error.status === 409) {
  //           // User is already registered for the event
  //           console.log('User is already registered for this event');
  //           this.showSnackbar('User is already registered for this event');
  //         } else {
  //           // Handle other errors
  //           console.error('An error occurred:', error);
  //           this.showSnackbar('An error occurred');
  //         }
  //       }
  //     );
  //   } else {
  //     console.error('User ID not available');
  //     this.showSnackbar('User ID not available');
  //   }
  // }
  registerEvent(eventId: number): void {
    if (EventComponent.userId) {
      this.RegistrationEventService.registerForEvent(eventId, EventComponent.userId).subscribe(
        () => {
          // Handle successful registration
          console.log('Registration successful');
          this.showSnackbar('Registration successful', 'green'); // Green color for successful registration
        },
        error => {
          if (error.status === 409) {
            // User is already registered for the event
            console.log('User is already registered for this event');
            this.showSnackbar('User is already registered for this event', 'orange'); // Orange color for existing registration
          } else {
            // Handle other errors
            console.error('An error occurred:', error);
            this.showSnackbar('An error occurred', 'red'); // Red color for errors
          }
        }
      );
    } else {
      console.error('User ID not available');
      this.showSnackbar('User ID not available', 'red'); // Red color for errors
    }
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


  // private showSnackbar(message: string): void {
  //   this.snackBar.open(message, 'Close', {
  //     duration: 3000 // Duration in milliseconds
  //   });
  // }
  initEventMap(latitude: number, longitude: number): void {
    // Make sure the container is empty before creating a new map
    if (this.mapDetailContainer && this.mapDetailContainer.nativeElement) {
      if (this.map) {
        this.initMap();
        this.map.remove();
      }

      // Initialize the map with the given coordinates
      this.map = L.map(this.mapDetailContainer.nativeElement).setView([latitude, longitude], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // Add a marker at the given coordinates
      L.marker([latitude, longitude]).addTo(this.map)
        .bindPopup('Location de l\'événement').openPopup();

      // Make sure the map is properly sized to fit the container
      this.map.invalidateSize();
    } else {
      console.error('Map container not found.');
    }
  }



  toggleDescriptionD(eventId: number | undefined): void {
    if (eventId === undefined) return;
    this.expandedDescriptions[eventId] = !this.expandedDescriptions[eventId];
  }
  toggleDescription(event: Event): void {
    if (!this.expandedDescriptions[event.eventId]) {
      this.expandedDescriptions[event.eventId] = true;
    } else {
      this.expandedDescriptions[event.eventId] = !this.expandedDescriptions[event.eventId];
    }
  }
  handleEventClick(clickInfo: any): void {
    const eventId = clickInfo.event.extendedProps.eventId;
    this.openEventDetailsModal(clickInfo.event.extendedProps.eventId);

    if (eventId) {
      this.eventService.findOneEvent(eventId).subscribe({
        next: (event) => {
          this.selectedEventDetails = event;
          // Fermez le modal du calendrier si ouvert
          if (this.calendarModalRef) {
            this.calendarModalRef.close(); // ou .dismiss() selon la méthode d'implémentation
          }
          // Ouvrez le modal de détails de l'événement
          this.openModal(this.eventDetailsTemplate); // Assurez-vous que `eventDetailsTemplate` est un TemplateRef correct
        },
        error: (error) => console.error('Failed to load event details:', error)
      });
    } else {
      console.error('Event ID is undefined.');
    }
  }
  openModal(content: TemplateRef<any>, event?: Event) {
    this.modalRef = this.modalService.open(content, { size: 'lg' });

    if (event) {
      this.selectedEventDetails = event;
    }
    this.modalRef.shown.subscribe(() => {
      this.modalHasBeenShown = true;

      if (this.mapContainer && this.mapContainer.nativeElement) {
        if (this.map) {
          setTimeout(() => {
            if (this.map) this.map.invalidateSize();
          }, 10);
        } else if (event && event.latitude && event.longitude) {
          this.initEventMap(event.latitude, event.longitude);
        }
      }
    });

    this.modalRef.result.then(
      () => {
        if (this.map) {
          this.map.remove();
          this.map = null;
        }
        this.modalHasBeenShown = false;
      }, (reason) => {
        if (this.map) {
          this.map.remove();
          this.map = null;
        }
      }
    );
  }


  handleDateClick(arg: any): void {
    // arg.dateStr contient la date sélectionnée
    console.log('date click! ', arg.dateStr);
    // Ici, vous pouvez ouvrir une modal affichant les événements de cette date
    this.openEventsModal(arg.dateStr);
  }

  openEventsModal(date: string) {
    const modalRef = this.modalService.open(this.warningSuccessModal, {size: 'lg'});
    modalRef.componentInstance.date = date; // Assurez-vous que `warningSuccessModal` a une propriété `date`
  }

  openEventDetailsModal(event: Event): void {
    this.selectedEventDetails = event;
    this.modalRef = this.modalService.open(this.eventDetailsTemplate, { size: 'lg' });

    // Subscribe to modal 'shown' event and then initialize the map
    this.modalRef.shown.subscribe(() => {
      // We check if the mapDetailContainer is already initialized and if the selectedEventDetails have the required lat and long
      if (this.mapDetailContainer && this.selectedEventDetails && this.selectedEventDetails.latitude && this.selectedEventDetails.longitude) {
        this.initDetailMap(this.selectedEventDetails.latitude, this.selectedEventDetails.longitude);
      }
    });
  }

  ngOnInit(): void {
    this.loadEvents(this.currentPage, this.pageSize);
    this.eventId = parseInt(<string>this.route.snapshot.paramMap.get('id'));
    this.route.params.subscribe(params => {
      const eventId = +params['id']; // '+' convertit la chaîne en nombre
      if (eventId) {
        this.loadEventDetails(eventId);
        this.selectedEventId = eventId;
        this.fetchFeedbackForEachEvent(this.selectedEventId);
      } else {
        console.error("Event ID is missing or invalid.");
      }
    });
    this.updateAverageRating(this.eventId);
    this.loadEventsWithRatings();
    const calendarEvents = this.events.map(event => ({
      title: event.event_name,
      start: event.event_date,
      extendedProps: {
        eventId: event.eventId
      }
    }));
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: this.calendarEvents,
      color: colors['blue'],
      eventClick: this.handleEventClick.bind(this),
    };
    this.initializeCalendarOptions();

  }
  initializeCalendarOptions() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      themeSystem: 'bootstrap',
      initialView: 'dayGridMonth',
      events: this.events.map(event => ({
        title: event.event_name,
        start: new Date(event.event_date),
        allDay: true
      })),
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      // Add other necessary options
    };
  }
  public filterFeedbacks(feedbacks: FeedBack[]): FeedBack[] {
    const filteredFeedbacks = feedbacks.filter(feedback => {
      // Check if the feedback description contains any bad words
      return !this.badWords.some(badWord => {
        const regExp = new RegExp(`\\b${badWord}\\b`, 'gi');
        return regExp.test(feedback.description);
      });
    });

    return filteredFeedbacks;
  }
  isCommentSafe(comment: string): boolean {
    return !this.badWords.some(badWord => {
      const regExp = new RegExp(`\\b${badWord}\\b`, 'gi');
      return regExp.test(comment);
    });
  }


  updateAverageRating(eventId: number): void {
    this.eventService.updateEventAverageRating(eventId).subscribe({
      next: (response) => {
        console.log(response);
        // Assuming response.averageRating contains the updated average rating
        this.averageRating = response.averageRating;
      },
      error: (error) => {
        console.error('Error updating average rating:', error);
        // Handle errors, if any
      }
    });
  }

  loadEventsWithRatings(): void {
    this.eventService.getEventsWithRatings().subscribe({
      next: (events) => {
        this.events = events;
        this.calculateAverageRatings(); // Calculer les moyennes des notes de feedback
      },
      error: (error) => console.error('Error loading events with ratings:', error)
    });
  }

  calculateAverageRatings(): void {
    // Créez un tableau de promesses pour les notes moyennes de chaque événement
    const promises = this.events.map(event =>
      this.feedbackService.getAverageRatingForEvent(event.eventId).toPromise() // Convertissez l'Observable en Promise
    );

    // Utilisez Promise.all() pour attendre que toutes les promesses se terminent
    Promise.all(promises).then(averageRatings => {
      // Mettez à jour les événements avec les notes moyennes
      this.events.forEach((event, index) => {
        event.averageRating = averageRatings[index];
      });
    }).catch(error => {
      console.error('Error calculating average ratings:', error);
    });
  }


  loadAverageRatingsForEvents(): void {
    this.events.forEach(event => {
      this.feedbackService.getAverageRatingForEvent(event.eventId).subscribe(averageRating => {
        // Vous pouvez choisir de stocker cette moyenne dans l'objet événement lui-même
        // Assurez-vous que votre modèle Event a un champ pour stocker cette information
        event.averageRating = averageRating;
      });
    });
  }


  fetchSuggestions(query: string, context: 'add' | 'update'): void {
    const url = `https://photon.komoot.io/api/?q=berlin`;
    this.http.get<any>(url).subscribe(data => {
      this.locationSuggestions = data.features;
    });
  }

  selectSuggestion(suggestion: any, context: 'add' | 'update'): void {
    const lat = suggestion.geometry.coordinates[1];
    const lon = suggestion.geometry.coordinates[0];

    if (this.updateMap && this.marker) {
      this.updateMap.setView([lat, lon], 13);
      this.marker.setLatLng([lat, lon]);
    }

    this.locationSuggestions = []; // Clear suggestions
  }

  searchLocation(query: string, context: 'add' | 'update'): void {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q={searchTerm}`;
    this.http.get<any[]>(url).subscribe(results => {
      this.errorMessage = '';
      if (results.length > 0) {
        // Traitez les résultats
        // Assurez-vous d'ajuster le traitement des résultats selon le format attendu
      } else {
        console.log('No results found');
        this.errorMessage = 'No results found. Please try a different search.';
      }
      this.cdr.detectChanges();
    }, error => {
      console.error('Error during the search:', error);
      this.errorMessage = 'An error occurred during the search. Please try again.';
      this.cdr.detectChanges();
    });
  }

  // searchLocation(context: 'add' | 'update'): void {
  //   if (!this.searchQuery) {
  //     console.log('Search query is empty.');
  //     return;
  //   }
  //
  //   // Assuming this.eventService.searchLocation is implemented correctly
  //   this.eventService.searchLocation(this.searchQuery).subscribe(results => {
  //     if (this.map) {
  //       this.map.eachLayer(layer => {
  //         if (layer instanceof L.Marker) {
  //           this.map!.removeLayer(layer);
  //         }
  //       });
  //
  //       results.forEach((result: any) => {
  //         const { lat, lon, display_name } = result;
  //         L.marker([lat, lon]).addTo(this.map!).bindPopup(display_name || 'Unknown location').openPopup();
  //       });
  //     }
  //   }, error => {
  //     console.error('Error during the search:', error);
  //   });
  // }

  onSearchChange(event: Event): void {
    const latitude = event.place; // Access latitude directly
    // Now you can use the latitude value as needed
    console.log("Latitude:", event.place);
  }

  private initDetailMap(latitude: number = 0, longitude: number = 0): void {
    if (this.mapDetailContainer) {
      // Initialize the map
      this.map = L.map(this.mapDetailContainer.nativeElement).setView([latitude, longitude], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      L.marker([latitude, longitude]).addTo(this.map)
        .bindPopup(this.selectedEventDetails?.place || 'Event Location').openPopup();

      // Invalidate the map size to ensure it fits the container properly
      this.map.invalidateSize();
    }
  }
  updateMapLocation(lat: number, lon: number, context: 'add' | 'update'): void {
    const mapToUpdate = context === 'add' ? this.map : this.updateMap;
    if (mapToUpdate) {
      if (this.marker) {
        this.marker.remove(); // Remove the previous marker
      }
      mapToUpdate.setView([lat, lon], 13);
      this.marker = L.marker([lat, lon]).addTo(mapToUpdate);
    }
  }


  filterEvents(): void {
    console.log('Filtering with searchTerm:', this.searchTerm);
    if (this.searchTerm) {
      this.events = this.allEvents.filter(event =>
        event.event_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.event_description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      // Reset the events to allEvents when search term is cleared
      console.log('Resetting events to full list');
      this.events = [...this.allEvents];
    }
  }


  showModalWithMessage(message: string): void {
    this.warningMessage = message;
    const modalInstance = new bootstrap.Modal(this.warningSuccessModal.nativeElement);
    modalInstance.show();
  }

  showUpdateModal(event: Event): void {
    this.selectedEvent = event;
    // Set the form values from the selected event
    this.updateEventForm.patchValue({
      event_name: event.event_name,
      event_date: event.event_date,
      place: event.place,
      event_description: event.event_description,
      latitude: event.latitude,
      longitude: event.longitude,
    });

    const modal = new bootstrap.Modal(this.updateEventModal.nativeElement);
    modal.show();

    this.updateEventModal.nativeElement.addEventListener('shown.bs.modal', () => {
      console.log('Modal is shown, initializing map...');
      if (!this.updateMap && this.updateMapContainer) {
        this.initUpdateMap(event.latitude ?? 0, event.longitude ?? 0);
      }
    }, {once: true});

  }


  loadEvents(pageIndex: number, pageSize: number): void {
    this.eventService.findAllEvent(pageIndex, pageSize).subscribe({
      next: (response) => {
        console.log("API Response:", response);
        this.events = response.content.map((event: Event) => ({
          title: event.event_name,
          start: event.event_date,
          extendedProps: {
            eventId: event.eventId
          }
        }));
        const eventsWithFeedbacks: Event[] = response.content.map((event: Event) => ({
          ...event,
          feedbacks: [] // Initialisez les feedbacks comme un tableau vide
        }));

        // Stockez temporairement les événements pour éviter des changements d'état fréquents
        this.allEvents = eventsWithFeedbacks;
        this.totalItems = response.totalElements;
        this.currentPage = pageIndex;
        this.pageSize = pageSize;

        // Chargez les feedbacks pour chaque événement
        eventsWithFeedbacks.forEach((event: Event) => {
          this.feedbackService.findAllFeedBacksForEvent(event.eventId).subscribe(feedbacks => {
            event.feedbacks = feedbacks; // Attribuez les feedbacks chargés à l'événement
            this.events = [...this.allEvents]; // Mettez à jour l'état des événements dans le composant
          });
        });
        this.calendarOptions.events = this.events;
        this.updateCalendarEvents();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.showModalWithMessage('Error loading events. Please try again.');
      }
    });
  }

  private updateCalendarEvents(): void {
    const calendarEvents = this.events.map(event => ({
      title: event.event_name,
      start: event.event_date,
      extendedProps: {
        eventId: event.eventId
      }
    }));

    if (this.calendarComponent && this.calendarComponent.getApi()) {
      this.calendarComponent.getApi().removeAllEvents();
      this.calendarComponent.getApi().addEventSource(calendarEvents);
    }
  }
  fetchFeedbackForEachEvent(eventId: number | undefined): void {
    if (eventId === undefined) {
      console.error("Cannot fetch feedback because event ID is undefined.");
      // Handle the undefined case appropriately, perhaps by setting a default state
      return;
    }
    // Proceed with fetching feedback using eventId
    this.feedbackService.findAllFeedBacksForEvent(eventId).subscribe({
      next: (feedbacks) => {
        this.feedbacks = feedbacks.filter(feedback => this.isCommentSafe(feedback.description));
        console.log("Feedbacks fetched successfully for event ID", eventId);
      },
      error: (error) => {
        console.error("Error fetching feedbacks for event ID", eventId, ":", error);
      }
    });
  }


  changePage(event: PageEvent): void {
    this.loadEvents(event.pageIndex, event.pageSize);
  }


  nextPage(): void {
    if (this.currentPage < (this.totalItems / this.pageSize) - 1) {
      this.currentPage++;
      this.loadEvents(this.currentPage, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadEvents(this.currentPage, this.pageSize);
    }
  }


  addEvent(): void {
    if (this.newEventForm.valid) {
      if (this.map !== null) {

        const newEvent: Event = this.newEventForm.value;

        this.map.on('click', (e) => {
          const {lat, lng} = e.latlng;
          console.log(`New event location: ${lat}, ${lng}`);
          this.newEventForm.patchValue({
            place: `${lat}, ${lng}` // Or any other format you prefer
          });
        });

        this.eventService.addEvent(newEvent).subscribe(
          () => {
            this.showModalWithMessage('Event is add successfully!');

            console.log('Event added successfully.');
            this.newEventForm.reset();
            this.loadEvents(this.currentPage, this.pageSize);
            this.cdr.detectChanges();

          },
          error => {
            this.showModalWithMessage('Error adding event:');
          }
        );
      }
    }
  }
  askDeleteConfirmation(activityId: number): void {
    this.eventIdToDelete = activityId;
    const modal = new bootstrap.Modal(this.deleteConfirmationModal.nativeElement);
    modal.show();
  }

  confirmDeletion(): void {
    this.eventService.hasRelatedActivities(this.eventIdToDelete).subscribe(canDelete => {
      if (canDelete) {
        this.showModalWithMessage('Event cannot be deleted because it has related activities.');
      } else {
        this.eventService.deleteEvent(this.eventIdToDelete).subscribe(() => {
          this.showModalWithMessage('Event deleted successfully!');
          this.loadEvents(this.currentPage, this.pageSize); // Refresh the events list
        }, error => {
          this.showModalWithMessage('Error deleting the event. Please try again.');
        });
      }
    });

    const modalInstance = bootstrap.Modal.getInstance(this.deleteConfirmationModal.nativeElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }

  checkAndDeleteEvent(eventId: number): void {
    this.eventService.hasRelatedActivities(eventId).subscribe((hasRelated: boolean) => {
      if (hasRelated) {
        this.showModalWithMessage('This event has related activities and cannot be deleted.');
      } else {
        this.askDeleteConfirmation(eventId);
      }
    }, (error: any) => {
      console.error('Error checking for related activities:', error);
    });
  }

  loadRelatedData(event: Event): void {
    this.eventService.getRelatedUsers(event.eventId).subscribe(
      (users: User[]) => {
        if (users && users.length > 0) {
          event.users = users;
        }
      },
      (error: any) => {
        console.error('Error loading related users:', error);
      }
    );

    this.eventService.getRelatedActivities(event.eventId).subscribe(
      (activities: Activity[]) => {
        event.Activitys = activities;
      },
      (error: any) => {
        console.error('Error loading related activities:', error);
      }
    );

    this.eventService.getRelatedRegistrations(event.eventId).subscribe(
      (registrations: RegistrationEvent[]) => {
        event.RegistationEvents = registrations;
      },
      (error: any) => {
        console.error('Error loading related registrations:', error);
      }
    );
  }

  onUpdateEvent(): void {
    if (this.updateEventForm.valid && this.selectedEvent) {
      // Assuming selectedEvent is correctly populated
      const updatedEvent = {
        ...this.selectedEvent,
        ...this.updateEventForm.value
      };

      // Ensuring eventId is correctly utilized in the request
      if (this.selectedEvent.eventId !== undefined) {
        this.eventService.updateEvent(this.selectedEvent.eventId, updatedEvent).subscribe({
          next: () => {
            this.showModalWithMessage('Event updated successfully!');
            this.loadEvents(this.currentPage, this.pageSize); // Reload events list to show the updated event
            this.modalRef?.close(); // Assuming this.modalRef is the reference to your update modal
          },
          error: (error) => {
            console.error('Error updating event:', error);
            this.showModalWithMessage('Error updating event. Please try again.');
          }
        });
      } else {
        console.error('Error: Event ID is undefined. Cannot update event.');
        this.showModalWithMessage('Error: Missing event ID. Cannot update event.');
      }
    }
  }


  private initUpdateMap(latitude: number = 51.505, longitude: number = -0.09): void {
    if (this.updateMapContainer && this.updateMapContainer.nativeElement) {
      // Clear any existing map instance before initializing a new one
      if (this.updateMap) {
        this.updateMap.off();
        this.updateMap.remove();
      }
      this.updateMap = null;

      // Initialize the map
      this.updateMap = L.map(this.updateMapContainer.nativeElement, {
        center: [latitude, longitude],
        zoom: 13
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.updateMap);

      // Listen for click events on the map
      this.updateMap.on('click', (e: L.LeafletMouseEvent) => {
        console.log('Map clicked', e.latlng);
        const {lat, lng} = e.latlng;
        if (this.updateMap) {
          // Remove the existing marker if it exists
          if (this.marker) {
            this.marker.remove();
          }

          // Add a new marker to the map at the clicked location
          this.marker = new L.Marker(e.latlng, { icon: this.getCustomIcon() }).addTo(this.updateMap);

          // Perform reverse geocoding to get the address
          const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

          this.http.get<any>(geocodeUrl).subscribe(data => {
            const address = data.display_name; // The full address as a string
            console.log("Retrieved address:", address);

            // Update the form with the address and coordinates
            this.updateEventForm.patchValue({
              place: address, // Update the address field in your form
              latitude: lat,
              longitude: lng,
            });
          }, error => {
            console.error("Error fetching location name", error);
          });
        }
      });
    } else {
      console.error('Update map container is not defined.');
    }
  }

  private initMap(): void {
    if (!this.mapContainer) {
      console.error('Map container is not available');
      return;
    }
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map(this.mapContainer.nativeElement).setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    this.map.on('click', (e) => {

      if (this.marker && this.map) {
        this.map.removeLayer(this.marker);
      }

      const {lat, lng} = e.latlng;
      if (this.map) {
        if (this.marker) {
          this.marker.remove(); // Remove existing marker
        }
        this.marker = new L.Marker(e.latlng, { icon: this.getCustomIcon() }).addTo(this.map);
      }



      this.saveLocation(lat, lng);
    });
  }




  getCustomIcon(): L.Icon {
    return <Icon>L.divIcon({
      html: '<i class="fas fa-map-marker-alt" style="color: red; font-size: 24px;"></i>',
      iconSize: L.point(30, 42),
      iconAnchor: L.point(15, 42),
      className: 'my-custom-icon'
    });
  }
  private saveLocation(latitude: number, longitude: number): void {
    const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    this.http.get<any>(geocodeUrl).subscribe(data => {
      // Supposons que le champ 'place' dans le formulaire est utilisé pour stocker le nom de l'emplacement
      const locationName = data.display_name; // Ou utilisez un autre chemin dans l'objet data selon le format de réponse

      this.newEventForm.patchValue({
        place: locationName, // Mettez à jour le nom de l'emplacement dans le formulaire
        latitude: latitude,
        longitude: longitude
      });

      console.log("Location name updated:", locationName);
      // Note: Pas besoin d'appeler un service ici si le formulaire sera soumis pour sauvegarder l'événement
    }, error => {
      console.error("Error fetching location name", error);
    });
  }
  openFeedbackModal(eventId: number): void {
    this.selectedEventId = eventId;
    this.feedbackModalRef = this.modalService.open(this.feedbackModal, { centered: true });
  }
  setRating(rating: number) {
    // Calculer la valeur totale basée sur la note sélectionnée
    this.feedbackNote = rating * 4;

    for (let i = 0; i < 5; i++) {
      const starIcon = document.getElementById('star_' + i);
      if (starIcon) {
        if (i < rating) {
          starIcon.innerText = 'star';
        } else {
          starIcon.innerText = 'star_border';
        }
      }
    }
  }
  getStars(rating: number): {value: string, color: string}[] {
    // Assume the total rating is out of 20
    const maxRating = 20;
    let stars: {value: string, color: string}[] = [];

    // Determine the color based on the rating
    const color = rating >= 14 ? 'green' :
      rating >= 7 ? 'yellow' : 'red';

    // Calculate the number of full, half, and empty stars
    for (let i = 1; i <= 5; i++) {
      if (rating >= (i * maxRating / 5)) {
        stars.push({value: 'full', color: color});
      } else if (rating + (maxRating / 10) >= (i * maxRating / 5)) {
        stars.push({value: 'half', color: color});
      } else {
        stars.push({value: 'empty', color: 'grey'});
      }
    }
    return stars;
  }

  handleFeedbackSubmission(): void {
    if (!this.selectedEventId) {
      console.error("Event ID is undefined.");
      this.showModalWithMessage("Event ID is missing. Unable to submit feedback.");
      return;
    }

    this.feedbackService.addFeedback(this.selectedEventId, this.feedbackText, this.feedbackNote).subscribe({
      next: (response) => {
        console.log("Feedback submitted successfully", response);
        // Close the feedback modal
        if (this.feedbackModalRef) {
          this.feedbackModalRef.close();
        }

        // Update the average rating for the event
        this.updateAverageRating(this.selectedEventId);
      },
      error: (error) => {
        console.error("Failed to submit feedback", error);
        this.warningMessage = "Failed to submit feedback. Please try again later.";
        setTimeout(() => this.showModalWithMessage(this.warningMessage), 500);
      }
    });
  }






  getStarArray(rating: number = 0): string[] {
    // Initialize an array to hold the star class names
    let stars: string[] = [];

    // Loop to create the filled stars
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? 'filled_star' : 'empty_star');
    }

    return stars;
  }


  getEventById(eventId: number): Event | undefined {
    return this.events.find(event => event.eventId === eventId);
  }









  // this.feedbackService.addFeedback(feedback.event.eventId, feedback.description).subscribe(
  likeEvent(eventId: number): void {
    this.eventService.likeEvent(eventId).subscribe(
      (event: Event) => {
        console.log('Like successful:', event);
        // Update UI with updated event object
        // For example, you can update the liked status of the event in your UI model
      },
      (error) => {
        console.error('Error liking event:', error);
        // Handle errors, if any
      }
    );
  }

  dislikeEvent(eventId: number): void {
    this.eventService.dislikeEvent(eventId).subscribe(
      (event: Event) => {
        console.log('Dislike successful:', event);
        // Update UI with updated event object
        // For example, you can update the liked status of the event in your UI model
      },
      (error) => {
        console.error('Error disliking event:', error);
        // Handle errors, if any
      }
    );
  }

  loadEventDetails(eventId: number): void {
    this.eventService.findOneEvent(eventId).subscribe({
      next: (event) => {
        this.selectedEventDetails = event;

        // Assuming the event object includes an averageRating property
        this.averageRating = event.averageRating;

        // Call updateAverageRating here
        this.updateAverageRating(eventId);

        console.log("Event details loaded successfully", event);
      },
      error: (error) => {
        console.error("Failed to load event details", error);
      }
    });
  }


}

