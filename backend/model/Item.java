package com.MyStuff.Version.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.validation.constraints.Size;

@Entity
public class Item extends IdEntity {

    @Size(min = 3, max = 250)
    private String name;
    private String description;

    @Column(unique = true)
    private String itemSerial;

    @JoinColumn
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @OneToMany(mappedBy = "item", cascade = CascadeType.REFRESH)
    private List<ItemHasBeenFound> itemHasBeenFounds;

    public Item() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getItemSerial() {
        return this.itemSerial;
    }

    public List<ItemHasBeenFound> getItemHasBeenFounds() {
        return itemHasBeenFounds;
    }

    public void setItemHasBeenFounds(List<ItemHasBeenFound> itemHasBeenFounds) {
        this.itemHasBeenFounds = itemHasBeenFounds;
    }

    public void setItemSerial(String itemSerial) {
        this.itemSerial = itemSerial;
    }

}
