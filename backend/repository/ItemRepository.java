package com.MyStuff.Version.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.MyStuff.Version.model.Item;

public interface ItemRepository extends CrudRepository<Item, Long> {
    public List<Item> findByUserId(long UserId);

    Optional<Item> findByItemSerial(String itemSerial);

}
