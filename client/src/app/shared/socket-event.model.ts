import { SocketEvents } from './socket-event.enum';
export interface ISocketEvent {
	senderId: string;
	type: SocketEvents;
	iceCandidate?: RTCIceCandidate;
	offer?: RTCLocalSessionDescriptionInit | RTCSessionDescriptionInit;
	answer?: RTCLocalSessionDescriptionInit | RTCSessionDescriptionInit;
}
