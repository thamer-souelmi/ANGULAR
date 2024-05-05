import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Equipment, Room } from '../../../Models/Room';
import { RoomService } from '../../../Services/Room.service';
import {MatDialogRef} from "@angular/material/dialog";
import {Subject} from "rxjs";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  rooms: Room[] = [];
  selectedRoom: Room = new Room();
  editMode = false;
  equipmentOptions = Object.values(Equipment);
  @ViewChild('roomFormModal') roomFormModal: any;
  roomForm!: FormGroup;
  private deleteId: number | null = null;
  @ViewChild('deleteConfirm') deleteConfirmTemplate: any;
  page: number = 0;
  size: number = 10;
  filteredRooms: Room[] = [];  // Array to hold filtered rooms
  searchTerm: string = '';
  searchQuery = '';
  searchChanged: Subject<string> = new Subject<string>();
  filterModalRef: any; // Reference for the filter modal
  isAvailable: boolean | null = null;
  showEmojiPicker = false;

  constructor(
    private roomService: RoomService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,

  ) {
    this.searchChanged.pipe(
      debounceTime(300), // wait 300ms after the last event before emitting last event
      distinctUntilChanged() // only emit if value is different from previous value
    ).subscribe(model => {
      this.searchTerm = model;
      this.filterRooms();
   });
  //   this.roomForm = this.formBuilder.group({
  //     roomId: ['', Validators.required],
  //     startDate: ['', Validators.required],
  //     endDate: ['', Validators.required]
  //   });
  //   this.roomForm.get('startDate')!.valueChanges.subscribe(() => this.checkAvailability());
  //   this.roomForm.get('endDate')!.valueChanges.subscribe(() => this.checkAvailability());
  //
      }
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    const emoji = event.emoji.native;
    const control = this.roomForm.get('name');
    if (control) {
      control.setValue(control.value + emoji);
      // Do not toggle the emoji picker here
    }
  }
  checkAvailability(): void {
    const roomId = this.roomForm.get('roomId')!.value;
    const startDate = new Date(this.roomForm.get('startDate')!.value);
    const endDate = new Date(this.roomForm.get('endDate')!.value);

    if (roomId && startDate && endDate && startDate < endDate) {
      this.roomService.checkRoomAvailability(roomId, startDate, endDate).subscribe({
        next: (available) => {
          this.isAvailable = available;
          if (!available) {
            this.snackBar.open('Room is not available for the selected dates.', 'Close', { duration: 3000 });
          }
        },
        error: () => {
          this.snackBar.open('Failed to check availability.', 'Close', { duration: 3000 });
        }
      });
    }
  }
  ngOnInit(): void {
    this.loadRooms();
    this.setupSearch();
    this.initForm();

  }
  initForm(): void {
    this.roomForm = this.formBuilder.group({
      name: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      available: [false],
      equipment: [[]],
    });

    this.roomForm.get('startDate')!.valueChanges.subscribe(() => this.checkAvailability());
    this.roomForm.get('endDate')!.valueChanges.subscribe(() => this.checkAvailability());
  }

  setupSearch(): void {
    this.searchChanged.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(model => {
      this.searchTerm = model;
      this.filterRooms();
    });
  }

  applyFilter(): void {
    let filtered = _.deburr(this.searchQuery.toLowerCase());

    this.filteredRooms = this.rooms.filter(room => {
      const nameMatch = _.deburr(room.nameRoom.toLowerCase()).includes(filtered);
      return nameMatch;
    });

    // If you have a modal for results, handle it here
    if (this.filterModalRef) {
      this.filterModalRef.close();
    }
  }

  loadRooms(): void {
    this.roomService.getAllRooms(this.page, this.size).subscribe({
      next: (response: any) => {
        this.rooms = response.content;
        this.filteredRooms = this.rooms; // Ensure this is initially the same
        console.log('Rooms loaded:', this.rooms);
      },
      error: (error) => {
        console.error('Error fetching rooms:', error);
        this.showError('Failed to load rooms.');
      }
    });
  }

  filterRooms(): void {
    console.log('Filtering rooms for term:', this.searchTerm);
    this.filteredRooms = this.rooms.filter(room =>
      room.nameRoom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    // this.cdr.detectChanges();
    console.log('Filtered rooms:', this.filteredRooms);
  }

  onSearchQueryChanged(value: string): void {
    this.searchQuery = value; // Update the local variable if needed
    this.searchChanged.next(value); // Properly trigger the debounced search
  }

  nextPage(): void {
    this.page++;
    this.loadRooms();
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadRooms();
    }
  }
  openAddRoomModal(): void {
    this.selectedRoom = new Room(); // Reset selectedRoom
    this.editMode = false;
    this.roomForm.reset();
    this.modalService.open(this.roomFormModal);
  }

  openEditRoomModal(room: Room): void {
    this.selectedRoom = { ...room };
    this.editMode = true;
    this.roomForm.setValue({
      name: room.nameRoom,
      capacity: room.capacityRoom,
      available: room.available,
      equipment: room.equipmentR
    });
    this.modalService.open(this.roomFormModal);
  }

  onSubmit(): void {
    if (this.roomForm.valid) {
      const formData = this.roomForm.value;
      const roomData: Room = {
        nameRoom: formData.name,
        capacityRoom: formData.capacity,
        available: formData.available,
        equipmentR: formData.equipment,
        trainingSessions: []  // Provide a default empty array
      };

      if (this.editMode) {
        this.roomService.updateRoom(this.selectedRoom.id!, roomData).subscribe({
          next: room => {
            this.updateRoomList(room);
            this.modalService.dismissAll();
            this.showSnackbar('Room updated successfully', 'green'); // Green color for successful registration

          },
          error: error => {
            console.error('Failed to update room:', error);
            this.showSnackbar('Failed to update room', 'red'); // Green color for successful registration

          }
        });
      } else {
        this.roomService.createRoom(roomData).subscribe({
          next: room => {
            this.rooms.push(room);
            this.modalService.dismissAll();
            this.showSnackbar('Room added successfully', 'green'); // Green color for successful registration

          },
          error: error => {
            console.error('Failed to create room:', error);
            this.showSnackbar('Failed to create room', 'red'); // Green color for successful registration

          }
        });
      }
    } else {
      this.showSnackbar('Please fill out all required fields', 'red');
    }
  }

  onDelete(id: number): void {
    this.deleteId = id;
    this.modalService.open(this.deleteConfirmTemplate).result.then(
      (result) => {
        if (result === 'delete') {
          this.confirmDelete(this.modalService);
        }
      },
      (reason) => {
        this.deleteId = null;
      }
    );
  }

  confirmDelete(modal: any): void {
    modal.close();

    if (this.deleteId !== null) {
      this.roomService.deleteRoom(this.deleteId).subscribe({
        next: () => {
          this.rooms = this.rooms.filter(room => room.id !== this.deleteId);
          this.showSnackbar('Room deleted successfully.', 'green');
          this.deleteId = null;  // Reset the ID after deletion
        },
        error: (error) => {
          console.error('Failed to delete room', error);
          this.showSnackbar('Failed to delete room', 'red');
          this.deleteId = null;
        }
      });
    }
  }

  updateRoomList(room: Room): void {
    const index = this.rooms.findIndex(r => r.id === room.id);
    if (index !== -1) {
      this.rooms[index] = room;
    } else {
      this.rooms.push(room);
    }
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['snackbar-error'] });
  }

  showInfo(message: string): void {
    this.snackBar.open(message, 'OK', { duration: 3000, panelClass: ['snackbar-info'] });
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

}
