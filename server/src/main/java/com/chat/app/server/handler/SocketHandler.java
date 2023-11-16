package com.chat.app.server.handler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
@Slf4j
public class SocketHandler extends AbstractWebSocketHandler {

  List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

  @Override
  public void handleTextMessage(WebSocketSession session, TextMessage message)
    throws InterruptedException, IOException {
    log.info("For session {} message received is: {}.", session.getId(), message.getPayload());
    for (WebSocketSession webSocketSession : sessions) {
      if (webSocketSession.isOpen() && !session.getId().equals(webSocketSession.getId())) {
        webSocketSession.sendMessage(message);
      }
    }
  }

  @Override
  public void afterConnectionEstablished(WebSocketSession session) throws Exception {
    sessions.add(session);
    log.info("For session {} connection established.", session.getId());
    for (WebSocketSession webSocketSession : sessions) {
      if (webSocketSession.isOpen() && !session.getId().equals(webSocketSession.getId())) {
        webSocketSession.sendMessage(new TextMessage("{\"type\": \"USER_JOINED\"}"));
      }
    }
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception{
    sessions.remove(session);
    log.info("For session {} connection closed.", session.getId());
    for (WebSocketSession webSocketSession : sessions) {
      if (webSocketSession.isOpen() && !session.getId().equals(webSocketSession.getId())) {
        webSocketSession.sendMessage(new TextMessage("{\"type\":\"USER_LEFT\"}"));
      }
    }
  }

}
