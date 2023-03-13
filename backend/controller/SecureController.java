package com.MyStuff.Version.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping(RestApi.SECURE_API)
public class SecureController {


    @GetMapping("/")
    @ResponseStatus(code = HttpStatus.OK)
    public String authenticateUser() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
