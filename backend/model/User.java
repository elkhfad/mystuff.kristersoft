package com.MyStuff.Version.model;

import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.NaturalId;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = { "username" }),
        @UniqueConstraint(columnNames = { "email" }) })
public class User extends IdEntity {

    @NotNull
    private String username;
    private boolean enabled = false;
    @NaturalId(mutable = true)
    @NotNull
    @Email
    private String email;
    private String color;
    private String defaultColor;
    private boolean isDefaultColor;
    private boolean isTable;
    @Column(name = "verification_code", length = 64)
    private String verificationCode;
    private String resetPasswordToken;

    @NotNull
    private String password;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REFRESH)
    @JsonManagedReference
    private List<Item> items;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REFRESH)
    @JsonManagedReference
    private List<ConversationChat> converstationChats;

    public User() {
    }

    public User(String username, String email, String password) {
        avatarColor();
        defaultColor();
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public void setTable(boolean isTable) {
        this.isTable = isTable;
    }

    public boolean getIstable() {
        return this.isTable;
    }

    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public List<ConversationChat> getConverstationChats() {
        return converstationChats;
    }

    public void setConverstationChats(List<ConversationChat> converstationChats) {
        this.converstationChats = converstationChats;
    }

    public String getResetPasswordToken() {
        return resetPasswordToken;
    }

    public void setResetPasswordToken(String resetPasswordToken) {
        this.resetPasswordToken = resetPasswordToken;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    private void avatarColor() {
        Random random = new Random();
        int num = random.nextInt(0xffffff + 1);
        String colorCode = String.format("#%06x", num);
        this.setColor(colorCode);
    }

    private void defaultColor() {
        this.setDefaultColor("#00264d");
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public boolean isDefaultColor() {
        return isDefaultColor;
    }

    public void setIsDefaultColor(boolean isDefaultColor) {
        this.isDefaultColor = isDefaultColor;
    }

    public String getDefaultColor() {
        return defaultColor;
    }

    public void setDefaultColor(String defaultColor) {
        this.defaultColor = defaultColor;
    }

}
