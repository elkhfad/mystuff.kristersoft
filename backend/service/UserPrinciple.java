package com.MyStuff.Version.service;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.MyStuff.Version.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class UserPrinciple implements UserDetails {
    private static final long serialVersionUID = 1L;

    private final Long id;

    private final String username;

    private final String email;
    @JsonIgnore
    private final String password;

    private final Collection<? extends GrantedAuthority> authorities;

    private boolean enabled;

    public UserPrinciple(Long id, String username, String email, String password, boolean enabled,
            Collection<? extends GrantedAuthority> authorities) {

        this.id = id;
        this.password = password;
        this.username = username;
        this.enabled = enabled;
        this.email = email;
        this.authorities = authorities;

    }

    public static UserPrinciple build(User user) {
        final List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(Role -> new SimpleGrantedAuthority(Role.getName().name()))
                .collect(Collectors.toList());
        return new UserPrinciple(user.getId(), user.getUsername(), user.getEmail(), user.getPassword(),

                user.isEnabled(), authorities);
    }

    public Long getId() {
        return id;
    }

    @Override
    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        final UserPrinciple user = (UserPrinciple) o;
        return Objects.equals(id, user.id);
    }

}
