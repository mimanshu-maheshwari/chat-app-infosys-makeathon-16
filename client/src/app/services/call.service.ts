import { ElementRef, Injectable } from '@angular/core';
import { SignalingService } from './signaling.service';

@Injectable({
  providedIn: 'root',
})
export class CallService {
  // connection: any;
  // configuration: RTCConfiguration = {
  //   iceServers: [
  //     {
  //       urls: [
  //         'stun:stun1.l.google.com:19302',
  //         'stun:stun2.l.google.com:19302',
  //       ],
  //     },
  //   ],
  //   iceCandidatePoolSize: 10,
  // };
  // constructor(private signalingService: SignalingService) {}
  // private async _initConnection(remoteVideo: ElementRef): Promise<void> {
  //   this.connection = new RTCPeerConnection(this.configuration);
  //   await this._getStreams(remoteVideo);
  //   this._registerConnectionListeners();
  // }
  // _registerConnectionListeners() {
  //   this.connection.onicecandidate = (event: any) => {
  //     if (event.candidate) {
  //       const payload = {
  //         type: 'candidate',
  //         candidate: event.candidate.toJSON(),
  //       };
  //       this.signalingService.sendMessage(payload);
  //     }
  //   };
  // }
  // private async _getStreams(remoteVideo: ElementRef): Promise<void> {
  //   const stream = await navigator.mediaDevices.getUserMedia({
  //     video: true,
  //     audio: true,
  //   });
  //   const remoteStream = new MediaStream();
  //   remoteVideo.nativeElement.srcObject = remoteStream;
  //   this.connection.ontrack = (event: any) => {
  //     event.streams[0].getTracks().forEach((track: any) => {
  //       remoteStream.addTrack(track);
  //     });
  //   };
  //   stream.getTracks().forEach((track) => {
  //     this.connection.addTrack(track, stream);
  //   });
  // }
  // public async handleCandidate(candidate: RTCIceCandidate): Promise<void> {
  //   if (candidate) {
  //     await this.connection.addIceCandidate(new RTCIceCandidate(candidate));
  //   }
  // }
  // public async handleAnswer(answer: RTCSessionDescription): Promise<void> {
  //   await this.connection.setRemoteDescription(
  //     new RTCSessionDescription(answer)
  //   );
  // }
  // public async makeCall(remoteVideo: ElementRef): Promise<void> {
  //   await this._initConnection(remoteVideo);
  //   const offer = await this.connection.createOffer();
  //   await this.connection.setLocalDescription(offer);
  //   this.signalingService.sendMessage({ type: 'offer', offer });
  // }
  // public async handleOffer(
  //   offer: RTCSessionDescription,
  //   remoteVideo: ElementRef
  // ): Promise<void> {
  //   await this._initConnection(remoteVideo);
  //   await this.connection.setRemoteDescription(
  //     new RTCSessionDescription(offer)
  //   );
  //   const answer = await this.connection.createAnswer();
  //   await this.connection.setLocalDescription(answer);
  //   this.signalingService.sendMessage({ type: 'answer', answer });
  // }
}
