import { Component, OnInit } from '@angular/core';
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
		this.callService.initCall(this.localAudioStream || new MediaStream(), this.localVideoStream || new MediaStream());
	}
	handleLocalVideoStream(event: MediaStream | null) {
		this.localVideoStream = event;
	}
	handleLocalAudioStream(event: MediaStream | null) {
		this.localAudioStream = event;
	}
}
