import { Component, ElementRef, OnInit, AfterViewChecked} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable,  of } from 'rxjs';
import { User } from 'src/app/Models/User';
import { Message } from 'src/app/Models/Message';
import { UserService } from 'src/app/Services/user.service';
import { StorageService } from 'src/app/Services/storage.service';

import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit,AfterViewChecked{
  url = 'http://localhost:8082';
  otherUser?: User;

  channelName?: string;
  socket?: WebSocket;
  stompClient?: Stomp.Client;
  newMessage = new FormControl('');
  messages?: Observable<Array<Message>>;
  imageSrcs: (string | ArrayBuffer | null)[] = [];
  imageSrcs1: (string | ArrayBuffer | null)[] = [];


  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private http:HttpClient,
    private el: ElementRef,
  private s:StorageService) {}
   thisUser!: User;
  selectedUserId: number | undefined;


  ngOnInit(): void {
    this.loadUsers();
    this.userService.getUserById(this.s.getUser().id).subscribe((user: User) => {
      this.thisUser = user;
       this.getImage1(this.thisUser.image)
    });
    // selectUser(userId: number) {
    //   this.selectedUserId = userId;
    //   // Retrieve user details based on the selected user ID
    //   this.userService.getUserById(userId).subscribe((data) => {
    //     this.otherUser = data;
    //     this.connectToChat(); // Call connectToChat() after updating otherUser
    //     console.log(this.el);
    //     this.el.nativeElement.querySelector("#chat").scrollIntoView();
    //   });
    // }
  }
  selectUser(event: Event) {
    const userId = (event.target as HTMLSelectElement).value;
    if (userId) {
      this.selectedUserId = Number(userId);
      this.userService.getUserById(this.selectedUserId).subscribe((data) => {
        this.otherUser = data;
        this.getImage(this.otherUser.image)
        this.connectToChat();
        console.log(this.el)
        this.el.nativeElement.querySelector("#chat").scrollIntoView();
      });
    } else {
      // Handle the case when no user is selected (optional)
      this.otherUser = undefined;
    }
  }
  
  ngAfterViewChecked(): void {
    this.scrollDown();
  }

  scrollDown(){
    var container = this.el.nativeElement.querySelector("#chat");
    container.scrollTop = container.scrollHeight;
  }

  connectToChat() {
    const id1 = this.s.getUser().id;
    const nick1 = this.thisUser.firstname;
    const id2 = this.otherUser?.userId!;
    const nick2 = this.otherUser?.firstname!;
console.log("id1", id1, "-------id2 ", id2);
    if (id1 > id2) {
      this.channelName = nick1 + '&' + nick2;
    } else {
      this.channelName = nick2 + '&' + nick1;
    }
    this.loadChat();
    console.log('connecting to chat...');
    this.socket = new SockJS(this.url + '/chat');
    this.stompClient = Stomp.over(this.socket);

    this.stompClient.connect({}, (frame) => {
      //func = what to do when connection is established
      console.log('connected to: ' + frame);
      this.stompClient!.subscribe(
        '/topic/messages/' + this.channelName,
        (response) => {
          //func = what to do when client receives data (messages)
          this.loadChat();
        }
      );
    });
  }

  sendMsg() {
    console.log(this.s.getUser().id)
    if (this.newMessage.value !== '') {
      this.stompClient!.send(
        '/app/chat/' + this.channelName,
        {},
        JSON.stringify({
          sender: this.thisUser.firstname,
          t_stamp: 'to be defined in server',
          msg: this.newMessage.value,
        })
      );
      this.newMessage.setValue('');
    }
  }

  loadChat(){
    this.messages = this.http.post<Array<Message>>(this.url+'/getMessages' ,  this.channelName);
    this.messages.subscribe(data => {
      let mgs:Array<Message> = data;
      mgs.sort((a, b) => (a.messageId > b.messageId) ? 1 : -1)
      this.messages = of(mgs);
    })
    console.log(this.messages);
  }

  whenWasItPublished(myTimeStamp: string) {
    const endDate = myTimeStamp.indexOf('-');
    return (
      ' at ' +
      myTimeStamp.substring(endDate + 1)
    );
  }
  users : User[] = [];
  loadUsers(){
    this.userService.findAllUsers().subscribe(
      users => {
        this.users = users;
        this.users.forEach(user => {
          // Load the user's image
        //  this.getImage(user.image);
        });
      },
      error => {
        console.error('Error loading users:', error);
      }
    );
  }

  getImage(filename: string): void {
    console.log("!!!!");
    if (!filename) return; // Skip if filename is not provided
    console.log("!!!!");

    this.userService.getFile(filename).subscribe(
      (response: HttpResponse<Blob>) => {
        if (response && response.body) {
          this.createImageFromBlob(response.body);
          console.log("............")
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
  getImage1(filename: string): void {
    console.log("!!!!");
    if (!filename) return; // Skip if filename is not provided
    console.log("!!!!");

    this.userService.getFile(filename).subscribe(
      (response: HttpResponse<Blob>) => {
        if (response && response.body) {
          this.createImageFromBlob1(response.body);
          console.log("............")
        } else {
          console.error('Error: Response body is null.');
        }
      },
      error => {
        console.error('Error fetching image:', error);
      }
    );
  }

  createImageFromBlob1(image: Blob): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imageSrcs1.push(reader.result);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

}
