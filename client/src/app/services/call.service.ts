import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SignalingService } from './signaling.service';
import { SocketEvents } from '../shared/socket-event.enum';
import { ISocketEvent } from '../shared/socket-event.model';

@Injectable({
	providedIn: 'root'
})
export class CallService {
	peerConnection!: RTCPeerConnection;
	remoteTracksSubject: Subject<{ tracks: Array<MediaStreamTrack> }> = new Subject();
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
	constructor(private signalingService: SignalingService) {
		this.signalingService.handleMessage(this.handleSSMsg);
	}

	public initCall(audioStream: MediaStream, videoStream: MediaStream) {
		this.createOffer(audioStream, videoStream);
	}

	private async createOffer(audioStream: MediaStream, videoStream: MediaStream) {
		// extract the tracks
		const audioTrack: MediaStreamTrack = audioStream.getAudioTracks()[0];
		const videoTrack: MediaStreamTrack = videoStream.getVideoTracks()[0];

		// create the peer connection
		this.peerConnection = new RTCPeerConnection(this.servers);

		// set tracks to peer connection
		if (audioStream && audioTrack) {
			console.debug('Adding audio track to peer connection: ', audioTrack);
			this.peerConnection.addTrack(audioTrack, audioStream);
		}
		if (videoStream && videoTrack) {
			console.debug('Adding video track to peer connection: ', videoTrack);
			this.peerConnection.addTrack(videoTrack, videoStream);
		}

		// handle the tracks recieved on the connection
		this.peerConnection.ontrack = (event) => {
			// sending the tracks to remote stream
			this.remoteTracksSubject.next({ tracks: event.streams[0].getTracks() });
		};

		// create get ice candidates from stun server
		this.peerConnection.onicecandidate = (event) => {
			if (event.candidate) {
				console.debug('New Ice Candidate: ', event.candidate);
				this.signalingService.sendMessage({ type: SocketEvents.CANDIDATE, iceCandidate: event.candidate });
			}
		};

		// create the offer configuration and set it to local description as well
		let offer: RTCLocalSessionDescriptionInit = await this.peerConnection.createOffer();
		await this.peerConnection.setLocalDescription(offer);
		console.debug('Offer: ', offer);
		this.signalingService.sendMessage({ type: SocketEvents.OFFER, offer });
	}

	handleSSMsg = (event: MessageEvent) => {
		console.debug('Event received from signaling server', event);
		if (event) {
			try {
				const data: ISocketEvent = JSON.parse(event.data);
				console.debug('Parsed data: ', data);
				switch (data.type) {
					case SocketEvents.CANDIDATE:
						console.debug('candidate event: ', data.iceCandidate);
						break;
					case SocketEvents.OFFER:
						console.debug('offer event: ', data.offer);
						break;
					case SocketEvents.ANSWER:
						console.debug('answer event: ', data.answer);
						break;
					default:
						break;
				}
			} catch (e) {
				console.error("Error: Couldn't parse event data from signaling server");
			}
		}
	};

	/**
	 * return a subject of media stream tracks.
	 * So that when we get new track we can emit the data and add to remote streams
	 */
	public get remoteTracks(): Subject<{ tracks: Array<MediaStreamTrack> }> {
		return this.remoteTracksSubject;
	}
}
