import { Component, OnInit } from '@angular/core';
import {ChatService} from "../../../Services/chat.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messageContent: string = '';  // Declare and initialize the variable

  constructor(public webSocketService: ChatService) { }

  ngOnInit(): void {
    this.webSocketService.initializeWebSocketConnection();
  }

  sendMessage(): void {
    if (this.messageContent.trim() !== '') {
      this.webSocketService.sendMessage({msg: this.messageContent});
      this.messageContent = '';  // Clear the message input after sending
    }
  }
}
