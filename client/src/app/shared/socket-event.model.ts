import { SocketEvents } from './socket-event.enum';
export interface ISocketEvent {
	type: SocketEvents;
	iceCandidate?: RTCIceCandidate;
	offer?: RTCLocalSessionDescriptionInit;
	answer?: any;
}
