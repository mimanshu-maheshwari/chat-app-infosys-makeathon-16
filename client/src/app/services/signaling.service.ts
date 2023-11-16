import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Socket } from 'ngx-socket-io';
// import { Observable } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
	providedIn: 'root'
})
export class SignalingService {
	constructor(private http: HttpClient) {}

	messageWebSocketCon = webSocket('ws://localhost:8080/socket');

	public sendMessage(message: string) {
		this.messageWebSocketCon.next({ message: message });
	}

	public getReciever() {
		return this.messageWebSocketCon;
	}

	public createRTCDataChannel() {}
}
