import { Injectable } from '@angular/core';
import { Stomp, CompatClient, Client, IFrame, ActivationState } from '@stomp/stompjs';
import * as SockJs from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { CallService } from './call.service';

@Injectable({
  providedIn: 'root'
})
export class SignalingService {
  private userId!: string;
  private stompClient!: CompatClient;
  public callService!: CallService;
  constructor() {}
  public connect(userId: string) {
    this.userId = userId;
    const WEB_SOCKET: WebSocket = new SockJs(environment.wsUrl);
    this.stompClient = Stomp.over(WEB_SOCKET);
    this.stompClient.onConnect = this.handleOnConnect;
    this.stompClient.onChangeState = this.handleChangeState;
    this.stompClient.onDisconnect = this.handleOnDisconnect;
    this.stompClient.activate();
  }

  handleOnConnect = (frame: IFrame) => {
    console.debug('Signaling Service::stompClient::handleOnConnect:frame', frame);
    this.callService = new CallService(this.stompClient);
    this.callService.load();
    this.callService.localVideoStart();
    this.callService.localAudioStart();
    this.sendMessage({ key: 'this is a try message' });
  };

  handleOnDisconnect = (frame: IFrame) => {
    console.debug('Signaling Service::stompClient::handleOnDisconnect::frame', frame);
  };

  handleChangeState = (state: ActivationState) => {
    console.debug('Signaling Service::stompClient::handleOnChangeState::::state', state);
  };

  public sendMessage(message: { [key: string]: any }) {
    if (this.stompClient && this.stompClient.active) {
      message = { ...message, userId: this.userId };
      console.debug('Signaling Service::sendMessage::message', message);
      // this.stompClient.send(environment.wsSendUrl, { 'content-type': 'application/json' }, message);
      this.stompClient.publish({
        destination: `${environment.wsSendUrl}`,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(message)
      });
    }
  }
}
