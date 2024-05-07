// import { Component, OnDestroy } from '@angular/core';
// import { ScreenshotService } from '../../../Services/Screenshot.service';
// import { Subscription, interval } from 'rxjs';

// @Component({
//   selector: 'app-screenshot',
//   templateUrl: './screenshot.component.html',
//   styleUrls: ['./screenshot.component.css']
// })
// export class ScreenshotComponent implements OnDestroy {
//   private timerSubscription!: Subscription;

//   constructor(private screenshotService: ScreenshotService) {
//     this.startTimer();
//   }

//   ngOnDestroy(): void {
//     if (this.timerSubscription) {
//       this.timerSubscription.unsubscribe();
//     }
//   }

//   private startTimer(): void {
//     const intervalTime = 10000; // 10 seconds
//     this.timerSubscription = interval(intervalTime).subscribe(() => {
//       this.captureScreenshot();
//     });
//   }

//   private captureScreenshot(): void {
//     const userId = 1; // Replace with actual user ID
//     // Create a dummy image (replace with actual image from webcam or screen capture)
//     const dummyImage = this.createDummyImage();
//     this.screenshotService.captureScreenshot(userId, dummyImage).subscribe(
//       response => {
//         console.log('Screenshot captured and saved successfully:', response);
//         // Handle success response
//       },
//       error => {
//         console.error('Failed to capture and save screenshot:', error);
//         // Handle error response
//       }
//     );
//   }

//   private createDummyImage(): File {
//     // Create a dummy image file (replace with actual logic to capture screen or webcam)
//     const text = 'Dummy image data';
//     const blob = new Blob([text], { type: 'text/plain' });
//     const dummyImage = new File([blob], 'dummy-image.txt');
//     return dummyImage;
//   }
// }
//camera screenshot
import { Component, OnDestroy } from '@angular/core';
import { ScreenshotService } from '../../../Services/Screenshot.service';
import { Subscription, interval } from 'rxjs';
import { StorageService } from 'src/app/Services/storage.service';

@Component({
  selector: 'app-screenshot',
  templateUrl: './screenshot.component.html',
  styleUrls: ['./screenshot.component.css']
})
export class ScreenshotComponent implements OnDestroy {
  private timerSubscription!: Subscription;
  id!: number;

  constructor(private screenshotService: ScreenshotService,private storage: StorageService) {
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private startTimer(): void {
    const intervalTime = 10000; // 10 seconds
    this.timerSubscription = interval(intervalTime).subscribe(() => {
      this.captureScreenshot();
    });
  }

  private captureScreenshot(): void {
    this.id = this.storage.getUser().id;

    const userId = 1; // Replace with actual user ID
    this.screenshotService.captureScreenshot(this.id).subscribe(
      response => {
        console.log('Screenshot captured and saved successfully:', response);
        console.log("user id ", this.id);

        // Handle success response
      },
      error => {
        console.error('Failed to capture and save screenshot:', error);
        console.log("user id ", this.id);
        // Handle error response
      }
    );
  }
}

