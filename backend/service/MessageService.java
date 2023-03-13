package com.MyStuff.Version.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.MyStuff.Version.model.Message;
import com.MyStuff.Version.model.User;
import com.MyStuff.Version.repository.MessageRepository;
import com.MyStuff.Version.repository.UserRepository;

@Component
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    private static final Logger logger = LoggerFactory.getLogger(MessageService.class);

    public List<Message> getMessages() {
        return messageRepository.findByUserId(userDetailsServiceImpl.getCurrentUser().getId());
    }

    public Message getMessage(Long id) {
        return messageRepository.findById(id).get();
    }

    public void addMessage(Message message) {
        final UsernamePasswordAuthenticationToken userDetails = (UsernamePasswordAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication();
        final Optional<User> userFound = userRepository
                .findByUsername(((UserDetails) userDetails.getPrincipal()).getUsername());
        if (userFound.isPresent()) {
            message.setUser(userFound.get());
        }
        logger.info("message send {}", message.getMessage());

        messageRepository.save(message);

    }

    public void updateMessage(Long id, Message message) {
        final Optional<User> userFound = userRepository.findById(message.getUser().getId());
        if (userFound.isPresent()) {
            logger.info("message saved {}", message.getMessage());
            messageRepository.save(message);
        }
    }

    public void removeMessage(Long id) {
        try {
            messageRepository.deleteById(id);
        } catch (Exception e) {
            messageRepository.findById(id).ifPresent(message -> {
                logger.info(String.format("message removed %s", id), e);
                message.setUser(null);
                messageRepository.save(message);
            });
        }
    }

}
