import {
	AfterViewInit,
	Component,
	ElementRef,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
	SimpleChanges,
	ViewChild
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-video',
	templateUrl: './video.component.html',
	styleUrls: ['./video.component.scss']
})
export class VideoComponent implements AfterViewInit, OnDestroy {
	@ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;
	@Input('is-local') isLocal: boolean = false;
	videoSourceObject: MediaStream | null = null;

	constructor(@Inject(PLATFORM_ID) private _platform: Object) {}

	ngAfterViewInit(): void {
		if (this.isLocal) {
			this.setForLocal();
		} else {
			this.setForRemote();
		}
	}

	async setForLocal() {
		if (isPlatformBrowser(this._platform) && 'mediaDevices' in navigator) {
			if (this.videoEl) {
				this.videoSourceObject = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
				this.videoEl.nativeElement.srcObject = this.videoSourceObject;
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

	setForRemote() {
		if (this.videoEl) {
			this.videoSourceObject = new MediaStream();
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
		this.videoSourceObject = null;
		this.videoEl.nativeElement.srcObject = null;
	}
}
