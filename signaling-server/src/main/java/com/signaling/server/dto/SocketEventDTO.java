package com.signaling.server.dto;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class SocketEventDTO {

  private SocketEvents type;

  private String senderId;

  private Object offer;

  private Object iceCandidate;

  private Object answer;

}
