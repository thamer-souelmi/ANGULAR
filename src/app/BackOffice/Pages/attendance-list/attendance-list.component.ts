import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/Services/attendance.service';
import { Attendance } from 'src/app/Models/Attendance';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css']
})
export class AttendanceListComponent implements OnInit {
  attendanceList: Attendance[] = [];

  constructor(private attendanceService: AttendanceService) { }

  ngOnInit(): void {
    this.attendanceService.getAllAttendances().subscribe(
      (attendances: Attendance[]) => {
        this.attendanceList = attendances;
      },
      (error) => {
        console.error('Failed to fetch attendance data:', error);
      }
    );
  }
}
