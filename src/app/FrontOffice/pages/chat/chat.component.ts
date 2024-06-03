import { Component, ElementRef, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/Models/User';
import { UserService } from 'src/app/Services/user.service';
import { Message } from 'src/app/Models/Message';
import { StorageService } from 'src/app/Services/storage.service';
// import { StompService } from '@stomp/ng2-stompjs';
// import { RxStompService } from '@stomp/ng2-stompjs'; // Import RxStompService
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  url = 'http://localhost:8082';
  otherUser?: User;
  thisUser!:User;
  channelName?: string;
  socket?: WebSocket;
  stompClient?: Stomp.Client;
  newMessage = new FormControl('');
  messages?: Observable<Array<Message>>;
  id!: number;
  
  constructor(
    private storageService: StorageService,
    private route: ActivatedRoute,
    private userService: UserService,
    private http: HttpClient,
    private el: ElementRef,
    // private rxStompService: RxStompService
  ) {}

  ngOnInit(): void {
    this.storageService.getUserById(this.id).subscribe(
      (user: User) => {
        this.thisUser = user; 
        console.log("The logged in user is", user);
        // Connect to chat after fetching user data
        this.connectToChat();
      },
      error => {
        console.error('Error fetching user:', error);
      }
    );
        // Define a static test message
        const testMessage: Message = {
          messageId: 0,
          sender: this.thisUser,
          t_stamp: 'to be defined in server',
          msg: 'This is a test message from the client'
        };
    
        // Log the test message
        console.log("Sending static test message:", testMessage);
    
        // Publish the test message using RxStompService
        // this.rxStompService.publish({
        //   destination: '/app/chat/test-channel', // Change 'test-channel' to your desired channel name
        //   body: JSON.stringify(testMessage)
        // });
    
        // Log a confirmation message
        console.log("Static test message sent successfully");
    // Log a message to verify WebSocket connection attempt
    console.log('Attempting WebSocket connection...');

    // Subscribe to the WebSocket topic
    // this.rxStompService.watch('/topic/messages').subscribe((message) => {
    //   console.log('Received message:', message);
    //   // Process the received message
    // });
    
    // Fetch user data using the obtained ID
    this.id = this.storageService.getUser().id;
    
    // Fetch user data and connect to chat
    
    
    // Fetch other user data and connect to chat
    this.userService.getUserById(2).subscribe((data) => {
      this.otherUser = data;
      this.otherUser.image = "data:image/jpeg;base64,"+ this.otherUser.image;
      this.connectToChat();
      console.log('Connected to chat');
      console.log('Other user:', this.otherUser);
      console.log('Channel name:', this.channelName);
      console.log('This user:', this.thisUser);
    });
  }
  
  ngAfterViewChecked(): void {
    this.scrollDown();
  }

  scrollDown() {
    var container = this.el.nativeElement.querySelector("#chat");
    container.scrollTop = container.scrollHeight;
  }

  connectToChat() {
    const id1 = 1;
    const nick1 = this.storageService.getUser().email;
    const id2 = this.otherUser?.userId!;
    const nick2 = this.otherUser?.email!;

    if (id1 > id2) {
      this.channelName = nick1 + '&' + nick2;
    } else {
      this.channelName = nick2 + '&' + nick1;
    }
    console.log('Connecting to chat...');
    console.log('Channel name:', this.channelName);
    console.log('User ID:', id1);
    console.log('Other user ID:', id2);
    this.loadChat();
    console.log('Chat loaded');
  }

  sendMsg12(channelName: string, message: Message) {
    // this.rxStompService.publish({
    //   destination: `/app/chat/${channelName}`,
    //   body: JSON.stringify(message)
    // });
  }

  sendMsg1() {
    if (this.newMessage.value !== '') {
      this.stompClient!.send(
        '/app/chat/' + this.channelName,
        {},
        JSON.stringify({
          sender: this.thisUser.email,
          t_stamp: 'to be defined in server',
          content: this.newMessage.value,
        })
      );
      this.newMessage.setValue('');
    }
  }

  sendMsg() {
    const testMessage: Message = {
      messageId: 0,
      sender: this.thisUser,
      t_stamp: 'to be defined in server',
      msg: 'This is a test message from the client'
    };
  
    // Log the test message
    console.log("Sending test message:", testMessage);
  
    // Publish the test message using RxStompService
    // this.rxStompService.publish({
    //   destination: '/app/chat/' + this.channelName,
    //   body: JSON.stringify(testMessage)
    // });
  
    // Log a confirmation message
    console.log("Test message sent successfully");
  }
  
  loadChat() {
    console.log('Loading chat...');
    console.log('Channel name:', this.channelName);
    this.messages = this.http.post<Array<Message>>(this.url + '/getMessages', this.channelName);
    this.messages.subscribe(data => {
      let mgs: Array<Message> = data;
      mgs.sort((a, b) => (a.messageId > b.messageId) ? 1 : -1)
      this.messages = of(mgs);
      console.log('Chat loaded successfully:', mgs);
    }, error => {
      console.error('Error loading chat:', error);
    });
  }

  whenWasItPublished(myTimeStamp: string) {
    const endDate = myTimeStamp.indexOf('-');
    return (
      myTimeStamp.substring(0, endDate) +
      ' at ' +
      myTimeStamp.substring(endDate + 1)
    );
  }
}
