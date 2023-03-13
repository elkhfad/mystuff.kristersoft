package com.MyStuff.Version.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.validation.constraints.Size;

@Entity
public class Permission extends IdEntity {

    private String email;
    @Size(max = 2000)
    private String pass;
    private Date created;
    private Date validTo;

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    @ManyToOne
    private ItemHasBeenFound itemHasBeenFound;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }

    public Date getValidTo() {
        return validTo;
    }

    public void setValidTo(Date validTo) {
        this.validTo = validTo;
    }

    public ItemHasBeenFound getItemHasBeenFound() {
        return itemHasBeenFound;
    }

    public void setItemHasBeenFound(ItemHasBeenFound itemHasBeenFound) {
        this.itemHasBeenFound = itemHasBeenFound;
    }
}
