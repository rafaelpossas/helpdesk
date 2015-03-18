/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.controller;

import com.br.helpdesk.model.EmailConfig;
import com.br.helpdesk.service.EmailConfigService;
import java.io.IOException;
import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@Controller
@RequestMapping("/emailconfig")
public class EmailConfigController {

    private EmailConfigService emailconfigService;

    public void setService(EmailConfigService service) {
        this.emailconfigService = service;
    }

    @Autowired
    public EmailConfigController(EmailConfigService service) {
        this.emailconfigService = service;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public @ResponseBody
    EmailConfig findById(@PathVariable long id) throws EntityNotFoundException {
        EmailConfig emailconfig = emailconfigService.findById(id);
        if (emailconfig == null) {
            throw new EntityNotFoundException();
        }
        return emailconfig;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public @ResponseBody
    void delete(@PathVariable Long id) throws EntityNotFoundException, DataIntegrityViolationException {
        EmailConfig emailconfig = emailconfigService.findById(id);
        if (emailconfig == null) {
            throw new EntityNotFoundException();
        }
        try {
            emailconfigService.remove(emailconfig);
        } catch (Exception e) {
            throw new DataIntegrityViolationException("Entidade possui dependencias e não pode ser deletada");//DEPENDENCIAS
        }
    }

    @RequestMapping(value = {"", "/{id}"}, method = {RequestMethod.PUT, RequestMethod.POST})
    @ResponseBody
    public EmailConfig save(@RequestBody EmailConfig emailconfig) {
        emailconfig = emailconfigService.save(emailconfig);
        return emailconfig;
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
