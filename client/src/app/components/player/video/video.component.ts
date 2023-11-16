import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Inject,
	Input,
	OnDestroy,
	Output,
	PLATFORM_ID,
	ViewChild
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CallService } from 'src/app/services/call.service';

@Component({
	selector: 'app-video',
	templateUrl: './video.component.html',
	styleUrls: ['./video.component.scss']
})
export class VideoComponent implements AfterViewInit, OnDestroy {
	@ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;
	@Input('is-local') isLocal: boolean = false;
	@Output('send-local-video-stream') sendLocalVideoStream: EventEmitter<MediaStream | null> =
		new EventEmitter<MediaStream | null>();
	@Output('send-local-audio-stream') sendLocalAudioStream: EventEmitter<MediaStream | null> =
		new EventEmitter<MediaStream | null>();
	videoSourceObject: MediaStream | null = null;
	unsubscribeAll: Subject<void>;

	constructor(@Inject(PLATFORM_ID) private _platform: Object, private callService: CallService) {
		this.unsubscribeAll = new Subject();
	}

	ngAfterViewInit(): void {
		if (this.isLocal) {
			this.setForLocal();
		} else {
			this.callService.remoteTracks.pipe(takeUntil(this.unsubscribeAll)).subscribe({
				next: (response: MediaStreamTrack[]) => {
					this.setForRemote(response);
				},
				error: (err) => {},
				complete: () => {}
			});
		}
	}

	async setForLocal() {
		if (isPlatformBrowser(this._platform) && 'mediaDevices' in navigator) {
			if (this.videoEl) {
				this.videoSourceObject = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
				this.videoEl.nativeElement.srcObject = this.videoSourceObject;
				this.sendLocalVideoStream.emit(this.videoSourceObject);
			}
		}
	}
	pauseForLocal() {
		if (this.videoEl) {
			this.videoEl.nativeElement.pause();
			(this.videoEl.nativeElement.srcObject as MediaStream).getVideoTracks()[0].stop();
			this.videoEl.nativeElement.srcObject = null;
			this.videoSourceObject = null;
		}
	}

	setForRemote(tracks: MediaStreamTrack[]) {
		if (this.videoEl) {
			this.videoSourceObject = new MediaStream();
			tracks.forEach((track) => {
				this.videoSourceObject?.addTrack(track);
			});
			this.videoEl.nativeElement.srcObject = this.videoSourceObject;
		}
	}

	handleVideoToggle(value: boolean) {
		if (value) {
			this.setForLocal();
		} else {
			this.pauseForLocal();
		}
	}
	handleMicToggle(value: boolean) {}

	ngOnDestroy(): void {
		this.unsubscribeAll.next();
		this.videoSourceObject = null;
		this.videoEl.nativeElement.srcObject = null;
	}
}
