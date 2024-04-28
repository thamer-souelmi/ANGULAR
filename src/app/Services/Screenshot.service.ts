// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Screenshot } from '../Models/Screenshot';

// @Injectable({
//   providedIn: 'root'
// })
// export class ScreenshotService {

//   private baseUrl = 'http://localhost:8082/api/screenshots';

//   constructor(private http: HttpClient) { }

// //   captureScreenshot(userId: number, image: File): Observable<any> {
// //     const formData: FormData = new FormData();
// //     formData.append('image', image);

// //     return this.http.post(`${this.baseUrl}/${userId}`, formData);
// //   }
// captureScreenshot(userId: number): Observable<any> {
//     return new Observable(observer => {
//       // Create a canvas element to draw the screenshot
//       const videoElement = document.createElement('video');
//       const canvas = document.createElement('canvas');
//       const context = canvas.getContext('2d');

//       // Request access to user's webcam
//       navigator.mediaDevices.getUserMedia({ video: true })
//         .then(stream => {
//           // Attach the stream to the video element
//           videoElement.srcObject = stream;
//           videoElement.play();

//           // Wait for the video to be ready
//           videoElement.onloadedmetadata = () => {
//             // Set canvas dimensions to match video dimensions
//             canvas.width = videoElement.videoWidth;
//             canvas.height = videoElement.videoHeight;

//             // Draw the current frame of the video onto the canvas
//             context?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

//             // Convert canvas content to Blob
//             canvas.toBlob(blob => {
//               if (blob) {
//                 const formData = new FormData();
//                 formData.append('image', blob);

//                 // Send the image data to the backend server
//                 this.http.post(`${this.baseUrl}/${userId}`, formData)
//                   .subscribe(
//                     response => {
//                       // Notify observer about successful capture
//                       observer.next(response);
//                       observer.complete();
//                     },
//                     error => {
//                       // Notify observer about error
//                       observer.error(error);
//                     }
//                   );
//               } else {
//                 observer.error('Failed to convert canvas content to Blob');
//               }
//             });
//           };
//         })
//         .catch(error => {
//           observer.error(error);
//         });
//     });
//   }
// }

//camera version 
// //screen version without
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { ImageCapture } from 'image-capture';


// @Injectable({
//     providedIn: 'root'
// })
// export class ScreenshotService {

//     private baseUrl = 'http://localhost:8082/api/screenshots';

//     constructor(private http: HttpClient) { }

//     captureScreenshot(userId: number): Observable<any> {
//         return new Observable(observer => {
//             // Request access to user's screen
//             navigator.mediaDevices.getDisplayMedia({ video: true })
//                 .then(stream => {
//                     const videoTrack = stream.getVideoTracks()[0];
//                     const imageCapture = new ImageCapture(videoTrack);
//                     return imageCapture.grabFrame();
//                 })
//                 .then(imageBitmap => {
//                     // Convert the image bitmap to a Blob
//                     const canvas = document.createElement('canvas');
//                     canvas.width = imageBitmap.width;
//                     canvas.height = imageBitmap.height;
//                     const context = canvas.getContext('2d');
//                     if (context) {
//                         context.drawImage(imageBitmap, 0, 0);
//                         canvas.toBlob(blob => {
//                             if (blob) {
//                                 const formData = new FormData();
//                                 formData.append('image', blob);

//                                 // Send the image data to the backend server
//                                 this.http.post(`${this.baseUrl}/${userId}`, formData)
//                                     .subscribe(
//                                         response => {
//                                             // Notify observer about successful capture
//                                             observer.next(response);
//                                             observer.complete();
//                                         },
//                                         error => {
//                                             // Notify observer about error
//                                             observer.error(error);
//                                         }
//                                     );
//                             } else {
//                                 observer.error('Failed to convert canvas content to Blob');
//                             }
//                         });
//                     } else {
//                         observer.error('Failed to create canvas context');
//                     }
//                 })
//                 .catch(error => {
//                     observer.error(error);
//                 });
//         });
//     }
// }

//screenshot with permission
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImageCapture } from 'image-capture';

@Injectable({
    providedIn: 'root'
})
export class ScreenshotService {

    private baseUrl = 'http://localhost:8082/api/screenshots';
    private permissionGranted = false;
    private screenStream: MediaStream | null = null;

    constructor(private http: HttpClient) { }

    captureScreenshot(userId: number): Observable<any> {
        return new Observable(observer => {
            if (!this.permissionGranted) {
                // Request access to user's screen
                navigator.mediaDevices.getDisplayMedia({ video: true })
                    .then(stream => {
                        this.permissionGranted = true;
                        this.screenStream = stream;
                        this.captureAndSendScreenshot(userId, observer);
                    })
                    .catch(error => {
                        observer.error(error);
                    });
            } else {
                // Permission already granted, capture and send screenshot
                this.captureAndSendScreenshot(userId, observer);
            }
        });
    }

    private captureAndSendScreenshot(userId: number, observer: any): void {
        if (!this.screenStream) {
            observer.error('No screen stream available');
            return;
        }

        const videoTrack = this.screenStream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(videoTrack);
        imageCapture.grabFrame()
            .then((imageBitmap: ImageBitmap) => {
                // Convert the image bitmap to a Blob
                const canvas = document.createElement('canvas');
                canvas.width = imageBitmap.width;
                canvas.height = imageBitmap.height;
                const context = canvas.getContext('2d');
                if (context) {
                    context.drawImage(imageBitmap, 0, 0);
                    canvas.toBlob(blob => {
                        if (blob) {
                            const formData = new FormData();
                            formData.append('image', blob);

                            // Send the image data to the backend server
                            this.http.post(`${this.baseUrl}/${userId}`, formData)
                                .subscribe(
                                    response => {
                                        // Notify observer about successful capture
                                        observer.next(response);
                                        observer.complete();
                                    },
                                    error => {
                                        // Notify observer about error
                                        observer.error(error);
                                    }
                                );
                        } else {
                            observer.error('Failed to convert canvas content to Blob');
                        }
                    });
                } else {
                    observer.error('Failed to create canvas context');
                }
            })
            .catch((error: any) => {
                observer.error(error);
            });
    }
}
