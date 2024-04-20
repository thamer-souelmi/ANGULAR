import { Component, OnInit } from '@angular/core';
import { Attendance, TypeAttendance } from 'src/app/Models/Attendance';
import { AttendanceService } from 'src/app/Services/attendance.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  attendance: Attendance = new Attendance(false, TypeAttendance.UNEXPLAINED_LEAVE); // Initialize with default values
  submitted = false;

  constructor(private attendanceService: AttendanceService) { }

  ngOnInit(): void {
  }

  submitAttendance(): void {
    this.attendanceService.addAttendance(this.attendance).subscribe(
      response => {
        console.log('Attendance added successfully:', response);
        this.submitted = true;
        // Optionally, reset the form after submission
        // this.attendance = new Attendance(false, '', '');
      },
      error => {
        console.error('Error adding attendance:', error);
      }
    );
  }
}
