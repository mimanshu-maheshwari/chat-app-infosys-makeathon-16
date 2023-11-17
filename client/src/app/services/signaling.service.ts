import { Injectable } from '@angular/core';
import { ISocketEvent } from '../shared/socket-event.model';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SignalingService {
	private URL: string = 'http://localhost:8080/socket';
	public stompClient;

	public roomSubject: Subject<string> = new Subject<string>();
	public senderSubject: Subject<string> = new Subject<string>();

	room: string = 'room';
	sender: string = 'sender_';

	constructor() {
		const ws = new SockJS(this.URL);
		this.stompClient = Stomp.over(ws);
		this.senderSubject.subscribe({
			next: (value) => (this.sender = value)
		});
		this.roomSubject.subscribe({
			next: (value) => (this.room = value)
		});
	}

	public sendMessage(message: ISocketEvent) {
		console.log('sending message: ', JSON.stringify({ ...message, senderId: `${this.sender}` }));
		this.stompClient.send(`/send/${this.room}`, { 'content-type': 'application/json' }, JSON.stringify(message));
	}

	// public handleMessage(callback: (message: MessageEvent) => void) {
	// 	// this.signalingSocket.onmessage = callback;
	// }
}
