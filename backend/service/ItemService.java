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

import com.MyStuff.Version.model.Item;
import com.MyStuff.Version.model.User;
import com.MyStuff.Version.repository.ItemRepository;
import com.MyStuff.Version.repository.UserRepository;

@Component
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;
    private static final Logger logger = LoggerFactory.getLogger(ItemService.class);
    private final static long OFFSET = 207203L;

    // @PostConstruct
    // public void postConstruct() {
    // Item item = new Item();
    // item.setItemSerial("111111");
    // item.setName("name");
    // item.setDescription("description");
    //
    // User user = new User();
    // user.setId(1L);
    // item.setUser(user);
    // itemRepository.save(item);
    // }
    public List<Item> getItems() {
        return itemRepository.findByUserId(userDetailsServiceImpl.getCurrentUser().getId());
    }

    public Item getItem(Long id) {
        return itemRepository.findById(id).get();
    }

    public void addItem(Item item) {
        final UsernamePasswordAuthenticationToken userDetails = (UsernamePasswordAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication();
        final Optional<User> userFound = userRepository
                .findByUsername(((UserDetails) userDetails.getPrincipal()).getUsername());
        if (userFound.isPresent()) {
            item.setUser(userFound.get());
            logger.info("add item {}", item.getName());
            itemRepository.save(item);
            item.setItemSerial("" + (item.getId() + OFFSET));
            itemRepository.save(item);

        }
    }

    public void updateItem(Item item) {
        if (item != null) {
            itemRepository.save(item);
        }
    }

    public void save(Item item) {
        if (item != null) {
            itemRepository.save(item);
        }
    }

    public void removeItem(Long id) {
        try {
            itemRepository.deleteById(id);
            logger.info("item deleted id {}", id);

        } catch (Exception e) {
            itemRepository.findById(id).ifPresent(item -> {
                item.setUser(null);
                itemRepository.save(item);
            });
        }
    }

}
