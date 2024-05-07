import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketServiceService {

  constructor(private socket: Socket) { }

  startRecognition() {
    this.socket.emit('start_login_process');
  }

  // Listen for recognition results from the server
  onRecognitionResults() {
    return this.socket.fromEvent<any>('login_process_completed');
  
  }}
