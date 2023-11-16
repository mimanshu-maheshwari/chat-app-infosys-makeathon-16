import { Output, Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { faMicrophone, faMicrophoneSlash, faVideoSlash, faVideo } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-controls',
	templateUrl: './controls.component.html',
	styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit, AfterViewInit {
	@Output('mic-toggle-emmiter') micToggleEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output('video-toggle-emmiter') videoToggleEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

	micState: boolean = true;
	videoState: boolean = true;

	videoIcon = this.videoState ? faVideo : faVideoSlash;
	micIcon = this.micState ? faMicrophone : faMicrophoneSlash;

	constructor() {}

	ngOnInit(): void {}

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
}
