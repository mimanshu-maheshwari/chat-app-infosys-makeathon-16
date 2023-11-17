import { Output, Component, OnInit, EventEmitter, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { faMicrophone, faMicrophoneSlash, faVideoSlash, faVideo, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { CallService } from 'src/app/services/call.service';
import { CallStatus } from 'src/app/shared/call-status.enum';

@Component({
	selector: 'app-controls',
	templateUrl: './controls.component.html',
	styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit, AfterViewInit, OnDestroy {
	@Output('mic-toggle-emmitter') micToggleEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output('video-toggle-emmitter') videoToggleEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output('end-call-emitter') endCallEmitter: EventEmitter<void> = new EventEmitter<void>();

	unsubscribeAll: Subject<void> = new Subject<void>();

	micState: boolean = true;
	inCall: CallStatus = CallStatus.IDLE;
	videoState: boolean = true;

	videoIcon = this.videoState ? faVideo : faVideoSlash;
	micIcon = this.micState ? faMicrophone : faMicrophoneSlash;
	phoneIcon = faPhone;

	constructor(private callService: CallService) {}

	ngOnInit(): void {
		this.callService.callStatus.pipe(takeUntil(this.unsubscribeAll)).subscribe({
			next: (response) => {
				this.inCall = response;
			}
		});
	}

	ngAfterViewInit(): void {
		this.micToggleEmitter.emit(this.micState);
		this.videoToggleEmitter.emit(this.videoState);
	}

	toggleMic() {
		this.micState = !this.micState;
		this.micToggleEmitter.emit(this.micState);
		this.micIcon = this.micState ? faMicrophone : faMicrophoneSlash;
	}

	toggleVideo() {
		this.videoState = !this.videoState;
		this.videoToggleEmitter.emit(this.videoState);
		this.videoIcon = this.videoState ? faVideo : faVideoSlash;
	}
	endCall() {
		this.endCallEmitter.emit();
	}

	get callStatus(): boolean {
		return this.inCall === CallStatus.INCALL;
	}
	ngOnDestroy(): void {
		this.unsubscribeAll.next();
	}
}
