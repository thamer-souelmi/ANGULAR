import { Component, OnInit } from '@angular/core';
import { Attendance } from 'src/app/Models/Attendance';
import { TypeAttendance } from 'src/app/Models/Attendance';

import { AttendanceService } from 'src/app/Services/attendance.service';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css']
})
export class AttendanceListComponent implements OnInit {
  attendanceList: Attendance[] = [];
  editingField: string | null = null;
  editedValue: any = null;

  constructor(private attendanceService: AttendanceService) { }

  ngOnInit(): void {
    this.getAttendance();
  }

  getAttendance(): void {
    this.attendanceService.getAttendance()
      .subscribe(attendanceList => {
        this.attendanceList = attendanceList;
      });
  }

  editField(event: MouseEvent, fieldName: string, attendance: Attendance): void {
    event.preventDefault();
    this.editingField = fieldName;
    this.editedValue = attendance[fieldName as keyof Attendance]; // Type assertion
    const inputElement = event.target as HTMLElement;
    const input = document.createElement('input');
    input.value = this.editedValue;
    input.addEventListener('blur', () => this.saveField(attendance, fieldName, input.value));
    input.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            this.saveField(attendance, fieldName, input.value);
        }
    });
    inputElement.innerHTML = '';
    inputElement.appendChild(input);
    input.focus();
    input.select();
}

saveField(attendance: Attendance, fieldName: string, value: any): void {
  this.editingField = null;
  this.editedValue = null;

  if (fieldName === 'typeAttendance') {
    // Check if the value is a valid enum value
    if (Object.values(TypeAttendance).includes(value)) {
      (attendance as any)[fieldName] = value;
    } else {
      // Handle invalid enum value
      console.error('Invalid typeAttendance value:', value);
      return;
    }
  } else {
    (attendance as any)[fieldName] = value;
  }

  // Update the field in the backend
  this.attendanceService.updateAttendance(attendance).subscribe(updatedAttendance => {
    console.log('Attendance updated:', updatedAttendance);
    alert('Attendance updated!');
  });
}

}
