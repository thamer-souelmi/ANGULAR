import {Component, OnInit} from '@angular/core';
import {Interview} from "../../../../Models/interview";
import {ActivatedRoute, Router} from "@angular/router";
import {InterviewService} from "../../../../Services/interview.service";

@Component({
  selector: 'app-interview-details-back',
  templateUrl: './interview-details-back.component.html',
  styleUrls: ['./interview-details-back.component.css']
})
export class InterviewDetailsBackComponent implements OnInit{
  candidacyId:number=0;
  interviews: Interview[] = [];

  constructor(
    private router: ActivatedRoute,
    private interviewService: InterviewService,private route: Router
  ) {
    this.router.params.subscribe(params => {
      this.candidacyId = +params['id'];
      console.log('Received Candidacy ID:', this.candidacyId);
      if (isNaN(this.candidacyId) || this.candidacyId <= 0) {
        console.log('Invalid Candidacy ID:', this.candidacyId);
      } else {
        this.loadInterviewDetails(this.candidacyId);
      }
    });
  }

  ngOnInit(): void {
    this.loadInterviewDetails(this.candidacyId);
  }

  loadInterviewDetails(candidacyId:number) {
    console.log('Loading interviews for Candidacy ID:', candidacyId);
    this.interviewService.findInterviewsByCandidacyId(candidacyId)
      .subscribe(interviews => {
        this.interviews = interviews;
      }, error => {
        console.error('Error fetching interviews:', error);
        // Handle error appropriately, e.g., show error message to user
      });
  }
  navigateToStatistics() {
    this.route.navigate(['/statisticsInterviews']);
  }
}
