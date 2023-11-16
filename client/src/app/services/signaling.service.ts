import { Injectable } from '@angular/core';
import { ISocketEvent } from '../shared/socket-event.model';

@Injectable({
	providedIn: 'root'
})
export class SignalingService {
	URL: string = 'ws://localhost:8080/socket';
	signalingSocket: WebSocket;

	constructor() {
		this.signalingSocket = new WebSocket(this.URL);
	}

	public sendMessage(message: ISocketEvent) {
		this.signalingSocket.send(JSON.stringify(message));
		// this.messageWebSocketCon.next({ message: message });
	}

	public handleMessage(callback: (message: MessageEvent) => void) {
		// return this.messageWebSocketCon;
		this.signalingSocket.onmessage = callback;
	}
}
