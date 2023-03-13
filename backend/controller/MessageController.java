package com.MyStuff.Version.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MyStuff.Version.dto.MessageDTO;
import com.MyStuff.Version.model.IdEntity;
import com.MyStuff.Version.service.MessageService;

@RestController
@RequestMapping(RestApi.MESSAGES)
public class MessageController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MessageController.class);

    @Autowired
    private MessageService messageService;

    @RequestMapping()
    public List<MessageDTO> getMessages() {
        LOGGER.info("Get all messages");
        return messageService.getMessages().stream().map(MessageDTO::new).collect(Collectors.toList());
    }

    @PostMapping()
    public List<MessageDTO> addMessage(@RequestBody MessageDTO message) {
        LOGGER.info("Add message");
        messageService.addMessage(message.build());
        return getMessages();
    }

    @PutMapping("/{id}")
    public void updateMessage(@PathVariable String id, @RequestBody MessageDTO message) {
        LOGGER.info("Update message");
        messageService.updateMessage(IdEntity.decrypt(id), message.build());
    }

    @DeleteMapping("/{id}")
    public List<MessageDTO> removeMessage(@PathVariable String id) {
        LOGGER.info("Remove message");
        messageService.removeMessage(IdEntity.decrypt(id));
        return getMessages();
    }

}
