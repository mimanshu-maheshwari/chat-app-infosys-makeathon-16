import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SignalingService } from 'src/app/services/signaling.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('localVideo', { static: false }) localVideoElRef!: ElementRef<HTMLVideoElement>;
  // @ViewChild('localAudio') localAudioElRef!: ElementRef<HTMLAudioElement>;
  @ViewChild('remoteVideo', { static: false }) remoteVideoElRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteAudio', { static: false }) remoteAudioElRef!: ElementRef<HTMLAudioElement>;

  private readonly userId: string = 'user ' + Math.random();

  constructor(private signalingService: SignalingService) {}

  ngAfterViewInit(): void {
    this.signalingService.connect(this.userId);
  }

  showLocalVideo() {
    this.localVideoElRef.nativeElement.srcObject = this.signalingService.callService.localVideoStream;
  }

  pauseLocalVideo() {
    this.signalingService.callService.pauseLocalVideo();
  }

  resumeLocalVideo() {
    this.signalingService.callService.resumeLocalVideo();
  }

  pauseLocalAudio() {
    this.signalingService.callService.pauseLocalAudio();
  }

  resumeLocalAudio() {
    this.signalingService.callService.resumeLocalAudio();
  }

  showRemoteVideo() {
    const remoteVideoStreams = this.signalingService.callService.remoteVideoStreams;
    const keys = Array.from(remoteVideoStreams.keys());
    const val = remoteVideoStreams.get(keys[0]);
    if (val) this.remoteVideoElRef.nativeElement.srcObject = val;
  }

  showRemoteAudio() {
    const remoteAudioStreams = this.signalingService.callService.remoteAudioStreams;
    const keys = Array.from(remoteAudioStreams.keys());
    const val = remoteAudioStreams.get(keys[0]);
    if (val) this.remoteAudioElRef.nativeElement.srcObject = val;
  }

  ngOnDestroy(): void {}
}
