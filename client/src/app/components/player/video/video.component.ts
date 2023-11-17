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
	@ViewChild('audioEl') audioEl!: ElementRef<HTMLAudioElement>;
	@Input('is-local') isLocal: boolean = false;

	videoSourceObject: MediaStream | null = null;
	audioSourceObject: MediaStream | null = null;
	unsubscribeAll: Subject<void>;

	constructor(@Inject(PLATFORM_ID) private _platform: Object, private callService: CallService) {
		this.unsubscribeAll = new Subject();

		if (isPlatformBrowser(this._platform) && 'mediaDevices' in navigator) {
			if (!this.videoSourceObject) {
				navigator.mediaDevices.getUserMedia({ video: true }).then((value) => {
					this.videoSourceObject = value;
					this.callService.localVideoStreamSubject.next(this.videoSourceObject);
				});
			}
			if (!this.audioSourceObject) {
				navigator.mediaDevices.getUserMedia({ audio: true }).then((value) => {
					this.audioSourceObject = value;
					this.callService.localAudioStreamSubject.next(this.audioSourceObject);
				});
			}
		}
	}

	ngAfterViewInit(): void {
		if (this.isLocal) {
			this.setVideoForLocal();
			this.setAudioForLocal();
		} else {
			this.callService.remoteTracks.pipe(takeUntil(this.unsubscribeAll)).subscribe({
				next: ({ tracks }) => {
					if (tracks.length) {
						this.setVideoForRemote(tracks);
						this.setAudioForRemote(tracks);
					} else {
						this.pauseVideo();
						this.pauseAudio();
					}
				},
				error: (err) => {},
				complete: () => {}
			});
		}
	}

	async setVideoForLocal() {
		if (isPlatformBrowser(this._platform) && 'mediaDevices' in navigator) {
			if (this.videoEl) {
				this.videoSourceObject = !this.videoSourceObject
					? await navigator.mediaDevices.getUserMedia({ video: true })
					: this.videoSourceObject;
				this.videoEl.nativeElement.srcObject = this.videoSourceObject;

				this.callService.localVideoStreamSubject.next(this.videoSourceObject);
			}
		}
	}

	async setAudioForLocal() {
		if (isPlatformBrowser(this._platform) && 'mediaDevices' in navigator) {
			if (this.audioEl) {
				this.audioSourceObject = !this.audioSourceObject
					? await navigator.mediaDevices.getUserMedia({ audio: true })
					: this.audioSourceObject;
				this.audioEl.nativeElement.srcObject = this.audioSourceObject;
				this.callService.localAudioStreamSubject.next(this.audioSourceObject);
			}
		}
	}

	pauseVideo() {
		if (this.videoEl) {
			this.videoEl.nativeElement.pause();
			// (this.videoEl.nativeElement.srcObject as MediaStream).getVideoTracks()[0].stop();
			// this.videoEl.nativeElement.srcObject = null;
			// if (!this.isLocal) {
			// 	this.videoSourceObject = null;
			// }
		}
	}

	pauseAudio() {
		if (this.audioEl) {
			this.audioEl.nativeElement.pause();
			(this.audioEl.nativeElement.srcObject as MediaStream).getAudioTracks()[0].stop();
			// this.audioEl.nativeElement.srcObject = null;
			// if (!this.isLocal) {
			// 	this.audioSourceObject = null;
			// }
		}
	}

	setAudioForRemote(tracks: MediaStreamTrack[]) {
		if (this.audioEl) {
			this.audioSourceObject = new MediaStream();
			tracks.forEach((track) => {
				this.audioSourceObject?.addTrack(track);
			});
			this.audioEl.nativeElement.srcObject = this.audioSourceObject;
		}
	}

	setVideoForRemote(tracks: MediaStreamTrack[]) {
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
			this.setVideoForLocal();
		} else {
			this.pauseVideo();
		}
	}

	handleMicToggle(value: boolean) {
		if (value) {
			this.setAudioForLocal();
		} else {
			this.pauseAudio();
		}
	}

	handleEndCall() {
		this.callService.disconnect();
	}

	ngOnDestroy(): void {
		this.unsubscribeAll.next();
		this.videoSourceObject = null;
		this.videoEl.nativeElement.srcObject = null;
		this.audioSourceObject = null;
		this.audioEl.nativeElement.srcObject = null;
	}
}
