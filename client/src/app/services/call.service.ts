import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CallService {
	peerConnection!: RTCPeerConnection;
	remoteTracksSubject: Subject<Array<MediaStreamTrack>> = new Subject();
	servers: RTCConfiguration = {
		iceServers: [
			{
				urls: [
					'stun:stun.l.google.com:19302',
					'stun:stun1.l.google.com:19302',
					'stun:stun2.l.google.com:19302',
					'stun:stun3.l.google.com:19302',
					'stun:stun4.l.google.com:19302'
				]
			}
		]
	};
	constructor() {}

	public initCall(audioStream: MediaStream, videoStream: MediaStream) {
		this.createOffer(audioStream, videoStream);
	}

	private async createOffer(audioStream: MediaStream, videoStream: MediaStream) {
		const audioTrack: MediaStreamTrack = audioStream.getAudioTracks()[0];
		const videoTrack: MediaStreamTrack = videoStream.getVideoTracks()[0];
		this.peerConnection = new RTCPeerConnection(this.servers);
		if (audioStream && audioTrack) {
			console.debug('Adding audio track to peer connection: ', audioTrack);
			this.peerConnection.addTrack(audioTrack, audioStream);
		}
		if (videoStream && videoTrack) {
			console.debug('Adding video track to peer connection: ', videoTrack);
			this.peerConnection.addTrack(videoTrack, videoStream);
		}
		this.peerConnection.ontrack = (event) => {
			this.remoteTracksSubject.next(event.streams[0].getTracks());
		};
		this.peerConnection.onicecandidate = (event) => {
			if (event.candidate) {
				console.debug('New Ice Candidate: ', event.candidate);
			}
		};
		let offer: RTCLocalSessionDescriptionInit = await this.peerConnection.createOffer();
		await this.peerConnection.setLocalDescription(offer);
		console.debug('Offer: ', offer);
	}
	public get remoteTracks(): Subject<Array<MediaStreamTrack>> {
		return this.remoteTracksSubject;
	}
}
