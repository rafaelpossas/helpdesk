/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.controller;

import com.br.helpdesk.model.User;
import com.br.helpdesk.service.EmailService;
import com.br.helpdesk.service.UserService;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.mail.MessagingException;
import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@Controller
@RequestMapping("/sendemail")
public class SendEmailController {

    @Autowired
    private EmailService emailService;

    public void setEmailService(EmailService service) {
        this.emailService = service;
    }

    @Autowired
    private UserService userService;

    public void setUserService(UserService service) {
        this.userService = service;
    }

    @RequestMapping(method = RequestMethod.GET, params = {"subject", "message", "groupClient"})
    public @ResponseBody
    Boolean sendEmail(@RequestParam(value = "subject") String subject,
            @RequestParam(value = "message") String message,
            @RequestParam(value = "groupClient") String groupClient) {

        List<Long> idClients = convertStringIdClientsToListLong(groupClient);
        List<User> users = userService.findByGroupClient(idClients);
        try {
            if (users.size() > 0) {
                List<String> listEmails = new ArrayList<String>();
                for (User user : users) {
                    if (user.getEmail() != null && !(user.getEmail().equals(""))) {
                        listEmails.add(user.getEmail());
                    }
                }
                emailService.sendEmailByScreenConfiguration(subject, message, listEmails);
            }
            return true;
        } catch (MessagingException e) {
            return false;
        }
    }

    public List<Long> convertStringIdClientsToListLong(String groupClient) {
        List<Long> idClients = new ArrayList<Long>();
        if (groupClient != null && !groupClient.equals("")) {
            idClients = new ArrayList<Long>();
            groupClient = groupClient.replace("[", "");
            groupClient = groupClient.replace("]", "");
            String[] ids = groupClient.split(",");
            if (ids.length > 0) {
                for (String id : ids) {
                    idClients.add(Long.parseLong(id));
                }
            }
        }
        return idClients;
    }

    /**
     * Exceptions Handler
     */
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Entidade não encontrada")
    public void handleEntityNotFoundException(Exception ex) {
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public void handleDataIntegrityViolationException(DataIntegrityViolationException ex, HttpServletResponse response) throws IOException {
        response.sendError(HttpServletResponse.SC_FORBIDDEN, ex.getMessage());
    }
}
