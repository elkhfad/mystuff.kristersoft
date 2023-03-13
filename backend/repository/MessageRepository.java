package com.MyStuff.Version.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.MyStuff.Version.model.Message;

public interface MessageRepository extends CrudRepository<Message, Long> {
    List<Message> findByUserId(long UserId);

    List<Message> findByConversationChatIdOrderByTimeDateAsc(long UserId);

    void save(Long id);

    void deleteByConversationChatId(Long id);

}
