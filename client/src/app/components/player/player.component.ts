import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CallService } from 'src/app/services/call.service';

@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
	localAudioStream!: MediaStream | null;
	localVideoStream!: MediaStream | null;

	constructor(private callService: CallService) {}

	ngOnInit(): void {}
	initCall() {
		if (this.localVideoStream && this.localAudioStream) {
			this.callService.localAudioStream = this.localAudioStream;
			this.callService.localVideoStream = this.localVideoStream;
			this.callService.initCall();
		}
	}

	handleLocalVideoStream(event: MediaStream) {
		this.localVideoStream = event;
		this.callService.localVideoStream = this.localVideoStream;
	}

	handleLocalAudioStream(event: MediaStream) {
		this.localAudioStream = event;
		this.callService.localAudioStream = this.localAudioStream;
	}

	get initButtonTitle(): string {
		let message = 'Initiate call';
		if (!this.localAudioStream || !this.localVideoStream) {
			message = '';
			if (!this.localAudioStream) {
				message += 'Audio permission required';
			}
			if (!this.localVideoStream) {
				if (message.length) message += '\n';
				message += 'Video permission required';
			}
		}
		return message;
	}
}
