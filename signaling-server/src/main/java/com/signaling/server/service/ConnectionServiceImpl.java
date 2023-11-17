package com.signaling.server.service;

import com.signaling.server.dto.SocketEventDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ConnectionServiceImpl implements ConnectionService {

  @Override
  public SocketEventDTO handleConnectionEvent(String room, SocketEventDTO event) {
    log.info("From room {} by sender {} event Received: {}", room, event.getSenderId(), event.getType());
    return event;
  }

}
