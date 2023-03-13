package com.MyStuff.Version.model;

import java.time.ZonedDateTime;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.Email;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "message")
public class Message extends IdEntity {

    private String message;

    @Email
    private String email;
    private boolean isMyMessage;

    private ZonedDateTime timeDate;
    private boolean readTime;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn
    @JsonBackReference
    private User user;

    @ManyToOne
    private ConversationChat conversationChat;

    @Lob
    private byte[] picture;

    public Message() {
        timeDate = ZonedDateTime.now();
    }

    public Message(String message) {
        this();
        this.message = message;

    }

    public ConversationChat getConversationChat() {
        return conversationChat;
    }

    public void setConversationChat(ConversationChat conversationChat) {
        this.conversationChat = conversationChat;
    }

    public byte[] getPicture() {
        return picture;
    }

    public void setPicture(byte[] picture) {
        this.picture = picture;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ZonedDateTime getTimeDate() {
        return timeDate;
    }

    public void setTimeDate(ZonedDateTime timeDate) {
        this.timeDate = timeDate;
    }

    public boolean isReadTime() {
        return readTime;
    }

    public void setReadTime(boolean readTime) {
        this.readTime = readTime;
    }

    public boolean isMyMessage() {
        return isMyMessage;
    }

    public void setMyMessage(boolean isMyMessage) {
        this.isMyMessage = isMyMessage;
    }

}
