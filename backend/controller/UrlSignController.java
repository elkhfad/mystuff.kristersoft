package com.MyStuff.Version.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MyStuff.Version.dto.MessageDTO;
import com.MyStuff.Version.model.IdEntity;
import com.MyStuff.Version.model.Permission;
import com.MyStuff.Version.repository.PermissionRepository;
import com.MyStuff.Version.service.ConverstationChatService;
import com.MyStuff.Version.service.UserDetailsServiceImpl;
import com.MyStuff.Version.service.UserPrinciple;

@RestController()
@RequestMapping(RestApi.URLSIGN)
public class UrlSignController {
    private static final Logger LOGGER = LoggerFactory.getLogger(UrlSignController.class);

    @Autowired
    private PermissionRepository permissionRepository;
    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Autowired
    private ConverstationChatService converstationService;

    @GetMapping("/{id}/messages")
    public List<MessageDTO> getConverstationChatMessages(@PathVariable String id) {
        final Long conversationId = IdEntity.decrypt(id);
        LOGGER.info("Get converstation messages by id", conversationId);
        if (canNotAccess(conversationId)) {
            LOGGER.info("We failed to access to converstation chat", conversationId);
            return new ArrayList<>();
        }
        LOGGER.info("We successfully get all converstation chat messages by id", conversationId);
        return converstationService.getConverstationChatMessages(conversationId)
                .stream()
                .map(MessageDTO::new)
                .collect(Collectors.toList());
    }

    @PostMapping("/{conversationId}")
    public void addMessage(@PathVariable String conversationId, @RequestBody MessageDTO messageDTO) {
        LOGGER.info("Trying to add message to converstation chat by id", conversationId);
        final Long decryptConversationId = IdEntity.decrypt(conversationId);
        if (canNotAccess(decryptConversationId)) {
            LOGGER.info("We failed to add message to converstation chat by id", conversationId);
            return;
        }
        LOGGER.info("We successfully added message to converstation chat by id", conversationId);
        converstationService.addMessageToChat(decryptConversationId, messageDTO.build());
    }

    private boolean canNotAccess(Long conversationId) {
        final UserPrinciple userPrinciple = userDetailsServiceImpl.getCurrentUser();
        final List<Permission> permissions = permissionRepository.findByEmailAndPass(userPrinciple.getEmail(),
                userPrinciple.getPassword());

        final Optional<Permission> permission = permissions
                .stream()
                .filter(p -> conversationId.equals(p.getItemHasBeenFound().getConverstationChat().getId()))
                .findFirst();
        return permission.isEmpty();
    }

}
