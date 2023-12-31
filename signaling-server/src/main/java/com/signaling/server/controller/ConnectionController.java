package com.signaling.server.controller;

import com.signaling.server.service.ConnectionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@CrossOrigin
@Slf4j
public class ConnectionController {

  @Autowired
  private ConnectionService connectionService;

//  @MessageMapping("/send/{room}")
//  @SendTo("/receive/{room}")
//  public SocketEventDTO receiveEvent(@DestinationVariable("room") String room, SocketEventDTO requestEvent) {
//    return this.connectionService.handleConnectionEvent(room, requestEvent);
//  }

  @MessageMapping("/send")
  @SendTo("/receive")
  public Object mediaSoupEvent(Message<Object> requestEvent) {
    log.info("Event Received by user: {}", requestEvent.getPayload());
    return requestEvent.getPayload();
  }

}