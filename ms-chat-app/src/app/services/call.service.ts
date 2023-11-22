// import { Injectable } from '@angular/core';
import { CompatClient, IMessage } from '@stomp/stompjs';
import * as mediaSoupClient from 'mediasoup-client';
import { Device } from 'mediasoup-client/lib/Device';
import { MediaKind, Consumer, Producer, Transport } from 'mediasoup-client/lib/types';
import { environment } from 'src/environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
export class CallService {
  private mediaSoupDevice: Device;

  private localVideo!: Producer;
  private localAudio!: Producer;

  private remoteVideos!: Map<string, Consumer>;
  private remoteAudios!: Map<string, Consumer>;

  public localTransport!: Transport;
  public remoteTransport!: Transport;

  public localVideoStream!: MediaStream;
  public localAudioStream!: MediaStream;

  public remoteVideoStreams!: Map<string, MediaStream>;
  public remoteAudioStreams!: Map<string, MediaStream>;
  constructor(private readonly stompClient: CompatClient) {
    // initialize global variables
    this.remoteVideoStreams = new Map<string, MediaStream>();
    this.remoteAudioStreams = new Map<string, MediaStream>();
    this.remoteVideos = new Map<string, Consumer>();
    this.remoteAudios = new Map<string, Consumer>();

    // create and get device as we would get from navigator.
    this.mediaSoupDevice = new mediaSoupClient.Device({});

    //subscribe to stomp client to receive events.
    this.stompClient.subscribe(encodeURIComponent(environment.wsReceiveUrl), this.handleStompEvents);
  }
  /**
   * handle events for stomp clients
   * @param event
   */
  handleStompEvents = (event: IMessage) => {
    console.debug('CallService::stompClient::handleStompEvents::event', event);
  };
  public load() {}
  public localVideoStart() {}
  public localAudioStart() {}
  public pauseLocalVideo() {}
  public pauseLocalAudio() {}
  public resumeLocalVideo() {}
  public resumeLocalAudio() {}
}
