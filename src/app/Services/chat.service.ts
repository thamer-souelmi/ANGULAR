import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket$!: WebSocketSubject<any>;
  private serverUrl = 'ws://localhost:8082/chat';  // Ensure this is the correct WebSocket URL

  constructor() {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    this.socket$ = new WebSocketSubject(this.serverUrl);

    this.socket$.subscribe(
      (message) => {
        if (message) {
          console.log('Received message: ', message);
        }
      },
      (err) => console.error('Encountered error: ', err),
      () => console.warn('Completed!')
    );
  }

  sendMessage(message: any) {
    this.socket$.next(JSON.stringify(message));
  }

  closeConnection() {
    this.socket$.complete();  // Properly close the connection
  }
}
