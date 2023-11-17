import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CallService } from 'src/app/services/call.service';
import { SignalingService } from 'src/app/services/signaling.service';

@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {
	localAudioStream!: MediaStream;
	localVideoStream!: MediaStream;
	unsubscribeAll: Subject<void> = new Subject<void>();
	senderId: string = '';

	constructor(private callService: CallService, private signalingService: SignalingService) {}
	ngOnDestroy(): void {
		this.unsubscribeAll.next();
	}

	updateSenderId(value: string) {
		this.senderId = value;
		this.signalingService.senderSubject.next(value);
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

	get initButtonTitle(): string {
		let message = 'Initiate call';
		if (!this.localAudioStream || !this.localVideoStream || !this.senderId) {
			message = '';
			if (!this.localAudioStream) {
				message += 'Audio permission required';
			}
			if (!this.localVideoStream) {
				if (message.length) message += '\n';
				message += 'Video permission required';
			}
			if (!this.senderId) {
				if (message.length) message += '\n';
				message += 'Add sender Id';
			}
		}
		return message;
	}
}
