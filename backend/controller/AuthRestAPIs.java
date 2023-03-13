package com.MyStuff.Version.controller;

import java.io.UnsupportedEncodingException;
import java.util.HashSet;
import java.util.Set;

import javax.mail.MessagingException;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MyStuff.Version.message.request.LoginForm;
import com.MyStuff.Version.message.request.SignUpForm;
import com.MyStuff.Version.message.response.JwtResponse;
import com.MyStuff.Version.model.Role;
import com.MyStuff.Version.model.RoleName;
import com.MyStuff.Version.model.User;
import com.MyStuff.Version.repository.RoleRepository;
import com.MyStuff.Version.repository.UserRepository;
import com.MyStuff.Version.security.jwt.JwtProvider;
import com.MyStuff.Version.service.UserDetailsServiceImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping(RestApi.API_AUTH)
public class AuthRestAPIs {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;
    @Autowired
    JwtProvider jwtProvider;
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthRestAPIs.class);

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginForm loginRequest) {
        LOGGER.info("User trying to sinIn {}");

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        LOGGER.info("generateJwtToken");
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtProvider.generateJwtToken(authentication);
        LOGGER.info("USER LOGGED_IN SUCCESSFULLY WELCOME BACK !");
        return ResponseEntity.ok(new JwtResponse(jwt, loginRequest.getUsername()));
    }

    @PostMapping("/signup")
    public ResponseEntity<Object> registerUser(@Valid @RequestBody SignUpForm signUpRequest)
            throws UnsupportedEncodingException, MessagingException {
        LOGGER.info("New User trying to singUp :)");
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            LOGGER.info("New User trying to singUp but username is already taken! {}");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new HttpResponse("nonUniqueUsername", "Username is already taken!"));

        }
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            LOGGER.info("New User trying to singUp but Email is already taken!{}");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new HttpResponse("nonUniqueEmail", "Email is already taken!"));

        }

        // Create user's account
        User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(),
                signUpRequest.getPassword());
        userDetailsServiceImpl.register(user);

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("failed! -> Cause: User Role not find."));
        roles.add(userRole);

//        strRole.forEach(role -> {
//            switch (role) {
//            case "admin":
//                Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
//                        .orElseThrow(() -> new RuntimeException("failed! -> Cause: User Role not find."));
//                roles.add(adminRole);
//                break;
//            case "pm":
//                Role pmRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
//                        .orElseThrow(() -> new RuntimeException("failed! -> Cause: User Role not find. "));
//                roles.add(pmRole);
//                break;
//            default:
//                Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
//                        .orElseThrow(() -> new RuntimeException("failed! -> Cause: User Role not find."));
//                roles.add(userRole);
//            }
//        });
        user.setRoles(roles);
        userRepository.save(user);
        LOGGER.info("NEW USER HAS BEEN CREATED SUCCESSFULLY :)");
        return ResponseEntity.status(HttpStatus.CREATED).body("");
    }

    @GetMapping("/confirmEmail")
    public String verifyUser(@Param("code") String code) {
        if (userDetailsServiceImpl.verify(code)) {
            return "verify_success";
        }
        return "verify_fail";
    }
}
