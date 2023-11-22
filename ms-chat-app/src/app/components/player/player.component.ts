import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SignalingService } from 'src/app/services/signaling.service';

@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
	@ViewChild('localVideo', { static: false }) localVideoElRef!: ElementRef<HTMLVideoElement>;
	// @ViewChild('localAudio') localAudioElRef!: ElementRef<HTMLAudioElement>;
	@ViewChild('remoteVideo', { static: false }) remoteVideoElRef!: ElementRef<HTMLVideoElement>;
	@ViewChild('remoteAudio', { static: false }) remoteAudioElRef!: ElementRef<HTMLAudioElement>;

	private readonly userId: string = 'user ' + Math.random();

	constructor(private signalingService: SignalingService) {}

	ngOnInit(): void {
		this.signalingService.connect(this.userId);
	}

	showLocalVideo() {}
	pauseLocalVideo() {}
	resumeLocalVideo() {}
	pauseLocalAudio() {}
	resumeLocalAudio() {}
	showRemoteVideo() {}
	showRemoteAudio() {}
}
