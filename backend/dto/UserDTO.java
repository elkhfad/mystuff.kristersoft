package com.MyStuff.Version.dto;

import com.MyStuff.Version.model.IdEntity;
import com.MyStuff.Version.model.User;

public class UserDTO {
    public String id;
    public String email;
    public String username;
    public String password;
    public String confirmPassword;
    public String color;
    public boolean isTable = false;
    public boolean isDefaultColor = false;
    public String defaultColor;

    public UserDTO() {
    }

    public UserDTO(User user) {
        id = IdEntity.encrypt(user.getId());
        email = user.getEmail();
        username = user.getUsername();
        password = "DUMMY_PASSWORD";
        color = user.getColor();
        isTable = user.getIstable();
        isDefaultColor = user.isDefaultColor();
        defaultColor = user.getDefaultColor();
    }

    public User build() {
        final User userEntity = new User();
        userEntity.setId(IdEntity.decrypt(id));
        userEntity.setEmail(email);
        userEntity.setUsername(username);
        userEntity.setPassword(password);
        userEntity.setColor(color);
        userEntity.setTable(isTable);
        userEntity.setIsDefaultColor(isDefaultColor);
        userEntity.setDefaultColor(defaultColor);
        return userEntity;
    }

}
