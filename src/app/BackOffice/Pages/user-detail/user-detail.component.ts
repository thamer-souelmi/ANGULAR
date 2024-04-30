import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/Models/User';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent {

  userId: number = 0;
  user: User = {} as User;
  imageSrcs: (string | ArrayBuffer | null)[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = +params['id'];
      console.log('User Id:', this.userId);
      this.loadJobOfferDetails();
    });
  }


  loadJobOfferDetails(): void {
    // Fetch the job offer details using the service
    this.userService.getUserById(this.userId).subscribe(
      (result) => {
        this.user = result;
        this.getImage(result.image);
      },
      (error) => {
        console.error('Error loading job offer details', error);
      }
    );
  }
  getImage(filename: string): void {
    if (!filename) return; // Skip if filename is not provided

    this.userService.getFile(filename).subscribe(
      (response: HttpResponse<Blob>) => {
        if (response && response.body) {
          this.createImageFromBlob(response.body);
        } else {
          console.error('Error: Response body is null.');
        }
      },
      error => {
        console.error('Error fetching image:', error);
      }
    );
  }

  createImageFromBlob(image: Blob): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imageSrcs.push(reader.result);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

}

