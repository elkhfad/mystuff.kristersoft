package com.MyStuff.Version.service;

import java.io.UnsupportedEncodingException;
import java.util.Properties;

import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service("emailService")
public class EmailService {
    private static final Logger LOGGER = LoggerFactory.getLogger(EmailService.class);

    @Value("${mystuff.app.email.username}")
    private String email;
    @Value("${mystuff.app.email.password}")
    private String password;
    @Value("${spring.mail.port}")
    private String port;
    @Value("${spring.mail.host}")
    private String host;

    public void sendEmail(String recipientEmail, String subject, String content)
            throws MessagingException, UnsupportedEncodingException {
        LOGGER.info("Start Sending email to " + recipientEmail);
        final Properties prop = new Properties();
        prop.put("mail.smtp.username", email);
        prop.put("mail.smtp.password", password);
        prop.put("mail.smtp.host", host);
        prop.put("mail.smtp.port", port);
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.starttls.enable", "true"); // TLS
        // prop.put("mail.debug", "true");

        Session mailSession = Session.getInstance(prop, new javax.mail.Authenticator() {
            @Override
            protected javax.mail.PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(prop.getProperty("mail.smtp.username"),
                        prop.getProperty("mail.smtp.password"));
            }
        });

        Message message = new MimeMessage(mailSession);
//        message.setFrom(new InternetAddress("no-reply@gmail.com"));
        message.setFrom(new InternetAddress(email));
        message.setSubject(subject);
        /* Mail body with plain Text */
        message.setText(content);
        InternetAddress[] toEmailAddresses = InternetAddress.parse(recipientEmail);

        message.setRecipients(Message.RecipientType.TO, toEmailAddresses);

        /* Step 1: Create MimeBodyPart and set content and its Mime Type */
        BodyPart mimeBody = new MimeBodyPart();
        mimeBody.setContent(content, "text/html; charset=utf-8");
        mimeBody.setHeader("Content-Type", "text/html; charset=\"utf-8\"");
        /* Step 2: Create MimeMultipart and wrap the mimebody to it */
        Multipart multiPart = new MimeMultipart();

        multiPart.addBodyPart(mimeBody);
        /* Step 3: set the multipart content to Message in caller method */
        message.setContent(multiPart);

        Transport.send(message);
        LOGGER.info("Finished Sending email to " + recipientEmail);
    }

}
