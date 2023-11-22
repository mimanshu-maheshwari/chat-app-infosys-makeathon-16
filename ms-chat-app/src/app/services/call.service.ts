// import { Injectable } from '@angular/core';
import { CompatClient } from '@stomp/stompjs';
import * as mediaSoupClient from 'mediasoup-client';
import { Device } from 'mediasoup-client/lib/Device';

// @Injectable({
//   providedIn: 'root'
// })
export class CallService {
	mediaSoupDevice: Device;
	constructor(private readonly stompClient: CompatClient) {
		// create and get device as we would get from navigator.
		this.mediaSoupDevice = new mediaSoupClient.Device({});
	}
}
