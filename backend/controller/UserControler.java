package com.MyStuff.Version.controller;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MyStuff.Version.dto.UserDTO;
import com.MyStuff.Version.model.IdEntity;
import com.MyStuff.Version.model.User;
import com.MyStuff.Version.repository.UserRepository;
import com.MyStuff.Version.service.UserDetailsServiceImpl;

@RestController
@RequestMapping(RestApi.USERS)
public class UserControler {
    private static final Logger logger = LoggerFactory.getLogger(UserControler.class);

    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;
    @Autowired
    private UserRepository userRepository;

    @RequestMapping()
    public UserDTO getUser() {
        logger.info("Trying to find user {}");
        final Optional<User> user = userRepository.findById(userDetailsServiceImpl.getCurrentUser().getId());
        logger.info("We found user {}", user.get().getUsername());
        return new UserDTO(user.get());
    }

    @RequestMapping("/avatar")
    public String getUserAvatatrColor() {
        logger.info("Trying to find color  for avatar {}");
        final Optional<User> user = userRepository.findById(userDetailsServiceImpl.getCurrentUser().getId());
        logger.info("We found color for avatar {}" + user.get().getColor());
        return user.get().getColor();
    }

    @RequestMapping("/defaultColor")
    public String getDefaultColor() {
        logger.info("Request for defaultColor, are  ?");
        final Optional<User> user = userRepository.findById(userDetailsServiceImpl.getCurrentUser().getId());
        logger.info("Request for defaultColor, are they defaul ?" + user.get().getDefaultColor());
        if (user.get().isDefaultColor()) {
            return user.get().getColor();
        } else {
            return "#00264d";
        }

    }

    @DeleteMapping("/{id}")
    public void removeUser(@PathVariable String id) {
        logger.info("Remove user by id {}", IdEntity.decrypt(id));
        try {
            userDetailsServiceImpl.removeUser(IdEntity.decrypt(id));
            logger.info("Removed user by id successfully {}", IdEntity.decrypt(id));

        } catch (Exception e) {
            logger.info("Can not remove user by id successfully {}", e);
        }

    }

    @RequestMapping("/isTable")
    public boolean getUserTable() {
        logger.info("Request for items, are they table ?");
        final Optional<User> user = userRepository.findById(userDetailsServiceImpl.getCurrentUser().getId());
        logger.info("Request for items, are they table ?" + user.get().getIstable());
        return user.get().getIstable();
    }

    @PutMapping("/{id}")
    public void updateUser(@RequestBody UserDTO userDTO, @PathVariable String id) {
        logger.info("We want to update user information ?");
        final Optional<User> persistedUser = userRepository.findById(IdEntity.decrypt(id));
        persistedUser.ifPresent(userToUpdate -> {
            userToUpdate.setEmail(userDTO.email);
            logger.info("We set email ?", userDTO.email);
            userToUpdate.setUsername(userDTO.username);

            Optional.ofNullable(userDTO.password)
                    .filter(s -> s != null)
                    .map(String::trim)
                    .filter(s -> !"DUMMY_PASSWORD".equals(s))
                    .map(passwordEncoder::encode)
                    .ifPresent(s -> userToUpdate.setPassword(s));
            userToUpdate.setColor(userDTO.color);
            logger.info("We set color ?", userDTO.color);
            userToUpdate.setTable(userDTO.isTable);
            logger.info("We set isTable ?", userDTO.isTable);
            logger.info("We set isDefaultColor ?", userDTO.isDefaultColor);
            userToUpdate.setIsDefaultColor(userDTO.isDefaultColor);
            logger.info("We set isDefaultColor ?", userDTO.isDefaultColor);
            userDetailsServiceImpl.updateUser(userToUpdate);
            logger.info("user updated {}", userToUpdate.getUsername());
            logger.info("We set set default color ?", userDTO.defaultColor);
            if (userToUpdate.isDefaultColor()) {
                logger.info("We are trying to set default color ?", userDTO.defaultColor);
                userToUpdate.setDefaultColor(userToUpdate.getColor());
                logger.info("We set default color ?", userDTO.defaultColor);
            } else {
                userToUpdate.setDefaultColor("#00264d");
                logger.info("We are trying to set default color ?", userDTO.defaultColor);
            }
            userDetailsServiceImpl.updateUser(userToUpdate);

        });
    }
}
