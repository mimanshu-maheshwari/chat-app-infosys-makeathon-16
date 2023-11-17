package com.signaling.server.service;

import com.signaling.server.dto.SocketEventDTO;

public interface ConnectionService {

  public SocketEventDTO handleConnectionEvent(String room, SocketEventDTO event);

}
