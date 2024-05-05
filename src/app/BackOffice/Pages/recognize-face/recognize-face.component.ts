import { Component, ElementRef, OnInit, AfterViewChecked} from '@angular/core';
import { WebsocketServiceService } from 'src/app/Services/websocket-service.service';
@Component({
  selector: 'app-recognize-face', 
  templateUrl: './recognize-face.component.html',
  styleUrls: ['./recognize-face.component.css']
})
export class RecognizeFaceComponent implements OnInit{
  constructor(private websocketService: WebsocketServiceService) {}

  ngOnInit(): void {
    console.log("ezzzzzzz");
    this.websocketService.startRecognition();
    console.log("ezzzzzzz22222222");

    // Listen for login process completed event
    this.websocketService.onRecognitionResults().subscribe((data) => {
      console.log("te5dem ??????");

      // Handle the response data here
      console.log('Login process completed with user ID:', data);
      // Perform actions indicating a successful login, e.g., redirect to another page
    }, (error) => {
      console.error('Error occurred during login process:', error);
      // Perform actions indicating an error, e.g., display an error message to the user
    });
   
  }

  // Method to initiate the login process
  startLoginProcess() {
    console.log("!!!!!!!!!!!!!!!!!");
    this.websocketService.startRecognition();
  }
}