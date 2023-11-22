import { Injectable } from '@angular/core';
import { Stomp, CompatClient, Client, IFrame, ActivationState } from '@stomp/stompjs';
import * as SockJs from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { CallService } from './call.service';

@Injectable({
	providedIn: 'root'
})
export class SignalingService {
	stompClient!: CompatClient;
	callService!: CallService;
	constructor() {}
	public connect(userId: string) {
		const WEB_SOCKET: WebSocket = new SockJs(environment.wsUrl);
		this.stompClient = Stomp.over(WEB_SOCKET);
		this.stompClient.onConnect = this.handleOnConnect;
		this.stompClient.onChangeState = this.handleChangeState;
		this.stompClient.activate();
		// this.stompClient.connect({}, (frame: any) => {
		// });
	}

	handleOnConnect = (frame: any) => {
		console.debug('Signaling Service::stompClient::handleOnConnect:frame', frame);
		this.callService = new CallService(this.stompClient);
	};

	handleChangeState = (state: ActivationState) => {
		console.debug('Signaling Service::stompClient::handleOnChangeState::::state', state);
	};

	callback = (event: any) => {
		console.debug('Signaling Service::stompClient::subscribe::callback::event', event);
	};

	public sendMessage(message: string) {
		if (this.stompClient) {
			console.debug('Signaling Service::sendMessage::message', message);
			this.stompClient.send(environment.wsSendUrl, { 'content-type': 'application/json' }, message);
			this.stompClient.publish({
				destination: environment.wsSendUrl,
				headers: { 'content-type': 'application/json' },
				body: message
			});
		}
	}
}
