// import { Component, OnInit } from '@angular/core';
// import { AttendanceService } from 'src/app/Services/attendance.service';
// import { Attendance } from 'src/app/Models/Attendance';

// @Component({
//   selector: 'app-attendance-list',
//   templateUrl: './attendance-list.component.html',
//   styleUrls: ['./attendance-list.component.css']
// })
// export class AttendanceListComponent implements OnInit {
// togglePanel(_t5: Attendance) {
// throw new Error('Method not implemented.');
// }
//   attendanceList: Attendance[] = [];
//   uniqueDates: Date[] = []; // Define uniqueDates property
// expandedAttendance: any;

//   constructor(private attendanceService: AttendanceService) { }

//   ngOnInit(): void {
//     this.attendanceService.getAllAttendances().subscribe(
//       (attendances: Attendance[]) => {
//         this.attendanceList = attendances;
//         this.calculateUniqueDates(); // Call the method to calculate unique dates
//       },
//       (error) => {
//         console.error('Failed to fetch attendance data:', error);
//       }
//     );
//   }

//   calculateUniqueDates() {
//     // Extract unique dates from the attendanceList
//     const datesSet = new Set<string>();
//     this.attendanceList.forEach(attendance => {
//       if (attendance.start) { // Check if start is defined
//         const dateStr = new Date(attendance.start).toDateString();
//         datesSet.add(dateStr);
//       }
//     });
//     this.uniqueDates = Array.from(datesSet).map(dateStr => new Date(dateStr));
//   }
  
  
// }
// import { Component, OnInit } from '@angular/core';
// import { AttendanceService } from 'src/app/Services/attendance.service';
// import { Attendance } from 'src/app/Models/Attendance';

// @Component({
//   selector: 'app-attendance-list',
//   templateUrl: './attendance-list.component.html',
//   styleUrls: ['./attendance-list.component.css']
// })
// export class AttendanceListComponent implements OnInit {
//   attendanceList: Attendance[] = [];
//   uniqueDates: Date[] = [];
//   expandedAttendance: Attendance | null = null;

//   constructor(private attendanceService: AttendanceService) { }

//   ngOnInit(): void {
//     this.attendanceService.getAllAttendances().subscribe(
//       (attendances: Attendance[]) => {
//         this.attendanceList = attendances;
//         this.calculateUniqueDates();
//       },
//       (error) => {
//         console.error('Failed to fetch attendance data:', error);
//       }
//     );
//   }

//   calculateUniqueDates() {
//     const datesSet = new Set<string>();
//     this.attendanceList.forEach(attendance => {
//       if (attendance.start) {
//         const dateStr = new Date(attendance.start).toDateString();
//         datesSet.add(dateStr);
//       }
//     });
//     this.uniqueDates = Array.from(datesSet).map(dateStr => new Date(dateStr));
//   }

//   togglePanel(attendance: Attendance) {
//     if (this.expandedAttendance === attendance) {
//       this.expandedAttendance = null;
//     } else {
//       this.expandedAttendance = attendance;
//     }
//   }
// }
// import { Component, OnInit, Output, EventEmitter } from '@angular/core';
// import { AttendanceService } from 'src/app/Services/attendance.service';
// import { Attendance } from 'src/app/Models/Attendance';

// @Component({
//   selector: 'app-attendance-list',
//   templateUrl: './attendance-list.component.html',
//   styleUrls: ['./attendance-list.component.css']
// })
// export class AttendanceListComponent implements OnInit {
//   attendanceList: Attendance[] = [];
//   uniqueDates: Date[] = [];
//   expandedAttendance: Attendance | null = null;
//   attendancePages: { date: Date, attendanceList: Attendance[] }[] = [];
  
//   @Output() attendancePagesChanged = new EventEmitter<{ date: Date, attendanceList: Attendance[] }[]>();

//   constructor(private attendanceService: AttendanceService) { }

//   ngOnInit(): void {
//     this.attendanceService.getAllAttendances().subscribe(
//       (attendances: Attendance[]) => {
//         this.attendanceList = attendances;
//         this.calculateUniqueDates();
//         this.filterAttendanceByDate();
//         this.attendancePagesChanged.emit(this.attendancePages); // Emit the attendancePages array
//       },
//       (error) => {
//         console.error('Failed to fetch attendance data:', error);
//       }
//     );
//   }

//   calculateUniqueDates() {
//     const datesSet = new Set<string>();
//     this.attendanceList.forEach(attendance => {
//       if (attendance.start) {
//         const dateStr = new Date(attendance.start).toDateString();
//         datesSet.add(dateStr);
//       }
//     });
//     this.uniqueDates = Array.from(datesSet).map(dateStr => new Date(dateStr));
//   }

//   filterAttendanceByDate() {
//     this.uniqueDates.forEach(date => {
//       const filteredAttendance = this.attendanceList.filter(attendance => {
//         if (attendance.start) {
//           const attendanceDate = new Date(attendance.start).toDateString();
//           return attendanceDate === date.toDateString();
//         }
//         return false; // Return false if start date is undefined
//       });
//       this.attendancePages.push({ date, attendanceList: filteredAttendance });
//     });
//   }

//   togglePanel(attendance: Attendance) {
//     if (this.expandedAttendance === attendance) {
//       this.expandedAttendance = null;
//     } else {
//       this.expandedAttendance = attendance;
//     }
//   }
// }
import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/Services/attendance.service';
import { Attendance } from 'src/app/Models/Attendance';
function dateToString(date: Date): string {
  return date.toISOString().slice(0, 10); // Convert Date to string in "YYYY-MM-DD" format
}
@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css']
})
export class AttendanceListComponent implements OnInit {
  attendanceList: Attendance[] = [];
  uniqueDates: Date[] = [];
  expandedAttendance: Attendance | null = null;
  selectedDate: Date | null = null;
  attendanceChunks: { [date: string]: Attendance[][] } = {};
  currentPage: { [date: string]: number } = {};
  totalPageCount: { [date: string]: number } = {};
  
  constructor(private attendanceService: AttendanceService) { }

  ngOnInit(): void {
    this.attendanceService.getAllAttendances().subscribe(
      (attendances: Attendance[]) => {
        this.attendanceList = attendances;
        this.calculateUniqueDates();
      },
      (error) => {
        console.error('Failed to fetch attendance data:', error);
      }
    );
  }
  


 
  onDateSelected(selectedDate: Date) {
    this.selectedDate = selectedDate;
    this.filterAttendanceByDate(selectedDate); // Call the filter method when date is selected

  }

  filterAttendanceByDate(selectedDate: Date | null) {
    if (selectedDate) {
      this.attendanceService.getAllAttendances().subscribe(
        (attendances: Attendance[]) => {
          // Filter attendance records based on the selected date
          const filteredAttendances = attendances.filter(attendance => {
            if (attendance.start) {
              const attendanceDate = new Date(attendance.start);
              const formattedAttendanceDate = new Date(attendanceDate.getFullYear(), attendanceDate.getMonth(), attendanceDate.getDate());
              return formattedAttendanceDate.getTime() === selectedDate.getTime();
            }
            return false; // If start date is undefined, exclude this attendance record
          });
          this.attendanceList = filteredAttendances;
          this.calculateUniqueDates();
        },
        (error) => {
          console.error('Failed to fetch attendance data:', error);
        }
      );
    } else {
      // If no date is selected, reset the attendance list to show all records
      this.attendanceService.getAllAttendances().subscribe(
        (attendances: Attendance[]) => {
          this.attendanceList = attendances;
          this.calculateUniqueDates();
        },
        (error) => {
          console.error('Failed to fetch attendance data:', error);
        }
      );
    }
  }
  
  
  calculateUniqueDates() {
    const datesSet = new Set<string>();
    this.attendanceList.forEach(attendance => {
      if (attendance.start) {
        const dateStr = new Date(attendance.start).toDateString();
        datesSet.add(dateStr);
      }
    });
    this.uniqueDates = Array.from(datesSet).map(dateStr => new Date(dateStr));
  }
  navigateDate(direction: number) {
    if (this.selectedDate) {
      const newDate = new Date(this.selectedDate);
      newDate.setDate(newDate.getDate() + direction);
      this.selectedDate = newDate;
      this.filterAttendanceByDate(newDate);
    }
  }
  
  togglePanel(attendance: Attendance) {
    if (this.expandedAttendance === attendance) {
      this.expandedAttendance = null;
    } else {
      this.expandedAttendance = attendance;
    }
  }
}
