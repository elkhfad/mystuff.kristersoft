package com.MyStuff.Version.dto;

import java.util.Optional;

import org.checkerframework.checker.nullness.qual.Nullable;

import com.MyStuff.Version.LamdaBuilder;
import com.MyStuff.Version.model.ItemHasBeenFound;

public class ItemHasBeenFoundDTO {
    public String itemSerial;
    public MessageDTO message;
    public String subject;

    public ItemHasBeenFoundDTO() {
    }

    public ItemHasBeenFoundDTO(ItemHasBeenFound itemHasBeenFound) {
        itemSerial = itemHasBeenFound.getItemSerial();
        subject = itemHasBeenFound.getSubject();
        message = Optional.ofNullable(itemHasBeenFound.getMessage()).map(t -> {
            try {
                return new MessageDTO(t);
            } catch (final Exception e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            return message;
        }).orElse(null);

    }

    public ItemHasBeenFound build() {
        final ItemHasBeenFound itemHasBeenFoundEntity = new ItemHasBeenFound();
        itemHasBeenFoundEntity.setSubject(subject);
        itemHasBeenFoundEntity.setItemSerial(itemSerial);
        itemHasBeenFoundEntity.setMessage(LamdaBuilder.getOrNull(message, @Nullable MessageDTO::build));
        return itemHasBeenFoundEntity;
    }

}
