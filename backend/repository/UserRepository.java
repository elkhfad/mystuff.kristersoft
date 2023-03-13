package com.MyStuff.Version.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.MyStuff.Version.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    @Query("SELECT c FROM User c WHERE c.email = ?1")
    public User findByEmail(String email);

    public User findByResetPasswordToken(String token);

    Boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.verificationCode = ?1")
    public User findByVerificationCode(String code);

}
