package com.MyStuff.Version.dto;

import java.time.ZonedDateTime;
import java.util.Optional;

import com.MyStuff.Version.model.ConversationChat;
import com.MyStuff.Version.model.IdEntity;
import com.MyStuff.Version.model.Message;
import com.fasterxml.jackson.annotation.JsonFormat;

public class MessageDTO {
    public String id;
    public String subject;
    public String message;
    public String email;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    public ZonedDateTime timeDate;
    public String conversationId;
    public boolean isMyMessage = false;
    public boolean readTime = false;
    public String picture;

    public MessageDTO() {
    }

    public MessageDTO(Message message) {
        id = IdEntity.encrypt(message.getId());
        this.message = message.getMessage();
        email = message.getEmail();

        timeDate = message.getTimeDate();
        conversationId = Optional.ofNullable(message.getConversationChat())
                .map(ConversationChat::getId)
                .map(IdEntity::encrypt)
                .orElse(null);
        isMyMessage = message.getUser() != null;
        readTime = message.isReadTime();
        if (message.getPicture() != null) {
            picture = new String(message.getPicture());
        }
    }

    public Message build() {
        final Message messageEntity = new Message();
        messageEntity.setId(IdEntity.decrypt(id));
        messageEntity.setMessage(message);
        messageEntity.setEmail(email);
        messageEntity.setReadTime(readTime);
        final ConversationChat chat = Optional.ofNullable(conversationId).map(cid -> {
            final ConversationChat conversationChat = new ConversationChat();
            conversationChat.setId(IdEntity.decrypt(cid));
            return conversationChat;
        }).orElse(null);
        messageEntity.setConversationChat(chat);
        messageEntity.setPicture(Optional.ofNullable(picture).map(String::getBytes).orElse(null));

        return messageEntity;
    }

}
