//package com.signaling.server.config;
//
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.context.event.EventListener;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.messaging.SessionConnectEvent;
//import org.springframework.web.socket.messaging.SessionConnectedEvent;
//import org.springframework.web.socket.messaging.SessionDisconnectEvent;
//
//@Component
//@Slf4j
//public class ConnectionListener {
//
//  @EventListener(SessionConnectedEvent.class)
//  public void handleWebsocketConnectedListener(SessionConnectedEvent event) {
//    log.info("Session connected event: {}", event);
//  }
//
//  @EventListener(SessionDisconnectEvent.class)
//  public void handleWebsocketDisconnectListener(SessionDisconnectEvent event) {
//    log.info("session closed: {}", event);
//  }
//
//}
