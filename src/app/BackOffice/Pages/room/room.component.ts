import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Equipment, Room } from '../../../Models/Room';
import { RoomService } from '../../../Services/Room.service';
import {MatDialogRef} from "@angular/material/dialog";

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
  constructor(
    private roomService: RoomService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,

  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadRooms();
  }

  initForm(): void {
    this.roomForm = this.formBuilder.group({
      name: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      available: [false],
      equipment: [[]] // This should map to the formControlName
    });
  }

  loadRooms(): void {
    this.roomService.getAllRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
      },
      error: (error) => {
        console.error('Error fetching rooms:', error);
        this.showError('Failed to load rooms.');
      }
    });
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
