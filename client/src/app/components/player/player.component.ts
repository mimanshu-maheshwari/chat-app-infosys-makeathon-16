import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CallService } from 'src/app/services/call.service';

@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {
	localAudioStream!: MediaStream;
	localVideoStream!: MediaStream;
	unsubscribeAll: Subject<void> = new Subject<void>();

	constructor(private callService: CallService) {}
	ngOnDestroy(): void {
		this.unsubscribeAll.next();
	}

	ngOnInit(): void {
		this.callService.localAudioStreamSubject.pipe(takeUntil(this.unsubscribeAll)).subscribe({
			next: (stream) => (this.localAudioStream = stream)
		});
		this.callService.localVideoStreamSubject.pipe(takeUntil(this.unsubscribeAll)).subscribe({
			next: (stream) => (this.localVideoStream = stream)
		});
	}
	initCall() {
		if (this.localVideoStream && this.localAudioStream) {
			this.callService.initCall();
		}
	}

	// handleLocalVideoStream(event: MediaStream) {
	// 	this.localVideoStream = event;
	// 	this.callService.localVideoStream = this.localVideoStream;
	// }

	// handleLocalAudioStream(event: MediaStream) {
	// 	this.localAudioStream = event;
	// 	this.callService.localAudioStream = this.localAudioStream;
	// }

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
