import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SignalingService } from './signaling.service';
import { SocketEvents } from '../shared/socket-event.enum';
import { ISocketEvent } from '../shared/socket-event.model';
import { sortAndDeduplicateDiagnostics } from 'typescript';

@Injectable({
	providedIn: 'root'
})
export class CallService {
	private audioStream!: MediaStream;
	private videoStream!: MediaStream;

	public localAudioStreamSubject: Subject<MediaStream> = new Subject();
	public localVideoStreamSubject: Subject<MediaStream> = new Subject();

	private peerConnection!: RTCPeerConnection;

	public remoteTracksSubject: Subject<{ tracks: Array<MediaStreamTrack> }> = new Subject();

	// TODO: create stun server
	private servers: RTCConfiguration = {
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
		this.localAudioStreamSubject.subscribe({
			next: (stream) => {
				this.audioStream = stream;
			}
		});
		this.localVideoStreamSubject.subscribe({
			next: (stream) => {
				this.videoStream = stream;
			}
		});
	}

	// instead of initCall when the second user joined then create the offer
	public initCall() {
		this.createOffer();
	}

	private handleUserJoined() {
		this.createOffer();
	}
	private handleUserLeft() {
		this.remoteTracksSubject.next({ tracks: [] });
	}

	private async createOffer() {
		this.createPeerConnection();
		// create the offer configuration and set it to local description as well
		let offer = await this.peerConnection.createOffer();
		await this.peerConnection.setLocalDescription(offer);
		console.debug('Offer: ', offer);
		this.signalingService.sendMessage({ type: SocketEvents.OFFER, offer });
	}

	/**
	 *
	 * @param offer
	 * will create a answer and send it via socket
	 */
	private async handleOffer(offer: RTCSessionDescriptionInit) {
		if (this.audioStream && this.videoStream) {
			this.createPeerConnection();
			await this.peerConnection.setRemoteDescription(offer);
			const answer = await this.peerConnection.createAnswer();
			this.peerConnection.setLocalDescription(answer);
			this.signalingService.sendMessage({ type: SocketEvents.ANSWER, answer: answer });
		}
	}

	private handleAnswer(answer: RTCSessionDescriptionInit) {
		if (!this.peerConnection.currentRemoteDescription) {
			this.peerConnection.setRemoteDescription(answer);
		}
	}

	private handleIceCandidate(candidate: RTCIceCandidate) {
		if (this.peerConnection) {
			this.peerConnection.addIceCandidate(candidate);
		}
	}

	private createPeerConnection() {
		// extract the tracks
		const audioTrack: MediaStreamTrack = this.audioStream.getAudioTracks()[0];
		const videoTrack: MediaStreamTrack = this.videoStream.getVideoTracks()[0];
		// create the peer connection
		this.peerConnection = new RTCPeerConnection(this.servers);

		// set tracks to peer connection
		if (this.audioStream && audioTrack) {
			console.debug('Adding audio track to peer connection: ', audioTrack);
			this.peerConnection.addTrack(audioTrack, this.audioStream);
		}
		if (this.videoStream && videoTrack) {
			console.debug('Adding video track to peer connection: ', videoTrack);
			this.peerConnection.addTrack(videoTrack, this.videoStream);
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
	}

	private handleSSMsg = (event: MessageEvent) => {
		console.debug('Event received from signaling server', event);
		if (event) {
			try {
				const data: ISocketEvent = JSON.parse(event.data);
				// console.debug('Parsed data: ', data);
				switch (data.type) {
					case SocketEvents.CANDIDATE:
						console.debug('candidate event: ', data.iceCandidate);
						if (data.iceCandidate) {
							this.handleIceCandidate(data.iceCandidate);
						}
						break;
					case SocketEvents.OFFER:
						console.debug('offer event: ', data.offer);
						if (data.offer) {
							this.handleOffer(data.offer as RTCSessionDescriptionInit);
						}
						break;
					case SocketEvents.ANSWER:
						console.debug('answer event: ', data.answer);
						if (data.answer) {
							this.handleAnswer(data.answer as RTCSessionDescriptionInit);
						}
						break;
					case SocketEvents.USER_JOINED:
						console.debug('user joined event: ', data);
						this.handleUserJoined();
						break;
					case SocketEvents.USER_LEFT:
						console.debug('user left event: ', data);
						this.handleUserLeft();
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
