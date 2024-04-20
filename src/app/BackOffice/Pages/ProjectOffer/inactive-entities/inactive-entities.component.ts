import { Component, OnInit } from '@angular/core';
import { ActionLogService } from '../../../../Services/action-log.service';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { ProjectOfferService } from '../../../../Services/project-offer.service';
import { ProjectOffer } from 'src/app/Models/project-offer';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBarComponent } from '../custom-snack-bar/custom-snack-bar.component'; // Import the custom component

@Component({
  selector: 'app-inactive-entities',
  templateUrl: './inactive-entities.component.html',
  styleUrls: ['./inactive-entities.component.css']
})
export class InactiveEntitiesComponent implements OnInit {
  inactiveEntityIds!: Observable<number[]>; // Observable to hold inactive entity IDs
  inactiveProjectOffers!: Observable<ProjectOffer[]>; // Observable to hold inactive project offers

  constructor(
    private actionLogService: ActionLogService,
    private projectOfferService: ProjectOfferService,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) { }

  ngOnInit(): void {
    this.fetchInactiveEntityIds(); // Fetch inactive entity IDs when component initializes
    this.inactiveProjectOffers.subscribe(offers => {
      if (offers && offers.length > 0) {
        offers.forEach((projectOffer, index) => {
          setTimeout(() => {
            this.showInactiveProjectOffer(projectOffer);
          }, index * 6000); // Show each offer with a 5-second delay
        });
      }
    });
  }

  showInactiveProjectOffer(projectOffer: ProjectOffer): void {
    const snackBarRef = this.snackBar.openFromComponent(CustomSnackBarComponent, {
      duration: 5000, // Display the notification for 5 seconds
      data: { icon: 'notifications', title: projectOffer.projectTitle, message: projectOffer.description },
      panelClass: ['custom-snack-bar'] // Add custom panel class to style the snack bar
    });

    // Handle click on the snack bar to view content
    snackBarRef.onAction().subscribe(() => {
      // Dismiss the snack bar when action button is clicked
      snackBarRef.dismiss();
    });
  }

  fetchInactiveEntityIds(): void {
    this.inactiveEntityIds = this.actionLogService.getInactiveEntityIds();
    this.inactiveProjectOffers = this.inactiveEntityIds.pipe(
      switchMap((ids: number[]) => {
        return forkJoin<ProjectOffer[]>(
          ids.map((id: number) => this.projectOfferService.getProjectOfferById(id))
        );
      })
    );
  }
}
