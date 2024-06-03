import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Leaves } from 'src/app/Models/leaves';
import { LeavesService } from 'src/app/Services/leaves.service';
import {LeaveRequestDTO} from "../../../Models/LeaveRequestDTO";

@Component({
  selector: 'app-leaves-details',
  templateUrl: './leaves-details.component.html',
  styleUrls: ['./leaves-details.component.css']
})
export class LeavesDetailsComponent implements OnInit {
  leaveDetails!: LeaveRequestDTO;

  constructor(private leaveService: LeavesService) { }

  ngOnInit(): void {
    // Example IDs and dates, replace with actual values as needed
    this.leaveService.getLeaveRequestDetails(1, '2024-01-01', '2024-12-12').subscribe({
      next: (data) => this.leaveDetails = data,
      error: (error) => console.error('Failed to fetch leave details', error)
    });
  }
}
