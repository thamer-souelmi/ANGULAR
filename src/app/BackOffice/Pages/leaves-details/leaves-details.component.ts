import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Leaves } from 'src/app/Models/leaves';
import { LeavesService } from 'src/app/Services/leaves.service';

@Component({
  selector: 'app-leaves-details',
  templateUrl: './leaves-details.component.html',
  styleUrls: ['./leaves-details.component.css']
})
export class LeavesDetailsComponent {

  leaveId: number = 0;
  leave: Leaves = {} as Leaves;

  constructor(
    private route: ActivatedRoute,
    private leaveService: LeavesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.leaveId = +params['id'];
      console.log('leave Id:', this.leaveId);
      this.loadJobOfferDetails();
    });
  }


  loadJobOfferDetails(): void {
    // Fetch the job offer details using the service
    this.leaveService.getLeaveById(this.leaveId).subscribe(
      (result) => {
        this.leave = result;
      },
      (error) => {
        console.error('Error loading job offer details', error);
      }
    );
  }



}


