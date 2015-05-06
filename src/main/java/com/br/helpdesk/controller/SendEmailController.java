/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.controller;

import com.br.helpdesk.service.SendEmailService;
import java.io.IOException;
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
@RequestMapping("/email")
public class SendEmailController {

    @Autowired
    private SendEmailService sendEmailService;

    /**
     * Método que retorna um Json com dados do usuários baseado no id dos
     * clientes enviados <br>
     * como parâmetro.<br>
     * O Json possui o seguinte formato:<br>
     * {id:'1',name:'name1', client:'cliente1', status:'status1',<br>
     * email:'email1'},<br>
     * {id:'2',name:'name2', client:'cliente2', status:'status2',<br>
     * email:'email2'},<br>
     * {id:'3',name:'name3', client:'cliente3', status:'status3',<br>
     * email:'email3'}
     *
     * @author André Sulivam
     * @param groupClient
     * @return
     */
    @RequestMapping(value="/client",method = RequestMethod.POST)
    public @ResponseBody
    String geJsonEmails(@RequestParam(value="groupClient") String groupClient) {
        return sendEmailService.getJsonEmails(groupClient);
    }

    /**
     * Método para enviar email da tela de configurações ao usuário.
     *
     * @author André Sulivam
     * @param subject
     * @param message
     * @param emailUser
     * @param id
     * @return
     */
    @RequestMapping(method = RequestMethod.POST)
    public @ResponseBody
    String sendEmailSingle(@RequestParam(value = "subject") String subject,
            @RequestParam(value = "message") String message,
            @RequestParam(value = "emailUser") String emailUser,
            @RequestParam(value = "id") Long id) {
        return sendEmailService.sendEmailSingle(subject, message, emailUser, id);
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
