import { Component, Input } from '@angular/core';
import { Attendance } from 'src/app/Models/Attendance';

@Component({
  selector: 'app-attendance-page',
  templateUrl: './attendance-page.component.html',
  styleUrls: ['./attendance-page.component.css']
})
export class AttendancePageComponent {
  @Input() attendanceList: Attendance[] = [];
  @Input() pageDate: Date | null = null;
}
