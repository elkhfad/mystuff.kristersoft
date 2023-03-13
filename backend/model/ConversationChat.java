package com.MyStuff.Version.model;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "conversationchat")
public class ConversationChat extends IdEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn
    private User user;

    private boolean resolved;

    private ZonedDateTime timeDateCreateConverstationChat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn
    private ItemHasBeenFound itemHasBeenFound;

    @OneToMany(mappedBy = "conversationChat", cascade = CascadeType.ALL)
    private List<Message> messages = new ArrayList<>();

    public ConversationChat() {
        timeDateCreateConverstationChat = ZonedDateTime.now();
    }

    public String getSubject() {
        return subject;
    }

    public void setResolved(boolean resolved) {
        this.resolved = resolved;
    }

    public boolean isResolved() {
        return resolved;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    private String subject;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ItemHasBeenFound getItemHasBeenFound() {
        return itemHasBeenFound;
    }

    public void setItemHasBeenFound(ItemHasBeenFound itemHasBeenFound) {
        this.itemHasBeenFound = itemHasBeenFound;
    }

    public ZonedDateTime getTimeDateCreateConverstationChat() {
        return timeDateCreateConverstationChat;
    }

    public void setTimeDate(ZonedDateTime timeDateCreateConverstationChat) {
        this.timeDateCreateConverstationChat = timeDateCreateConverstationChat;
    }
}
