package com.MyStuff.Version.dto;

import com.MyStuff.Version.model.IdEntity;
import com.MyStuff.Version.model.Item;

public class ItemDTO {
    public String id;
    public String name;
    public String description;
    public String itemSerial;

    public ItemDTO() {
    }

    public ItemDTO(Item item) {
        id = IdEntity.encrypt(item.getId());
        name = item.getName();
        description = item.getDescription();
        itemSerial = item.getItemSerial();

    }

    public Item build() {
        final Item itemEntity = new Item();
        itemEntity.setId(IdEntity.decrypt(id));
        itemEntity.setName(name);
        itemEntity.setDescription(description);
        itemEntity.setItemSerial(itemSerial);
        return itemEntity;
    }

}
