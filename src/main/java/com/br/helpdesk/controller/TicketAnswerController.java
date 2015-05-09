/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.controller;

import com.Consts;
import com.br.helpdesk.model.Attachments;
import com.br.helpdesk.model.Ticket;
import com.br.helpdesk.model.TicketAnswer;
import com.br.helpdesk.model.User;
import com.br.helpdesk.service.AttachmentsService;
import com.br.helpdesk.service.EmailService;
import com.br.helpdesk.service.TicketAnswerService;
import com.br.helpdesk.service.TicketService;
import com.br.helpdesk.service.UserService;
import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;
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

/**
 *
 * @author ricardo
 */
@Controller
@RequestMapping("/ticket-answer")
public class TicketAnswerController {

    private TicketAnswerService answerService;

    public void setService(TicketAnswerService service) {
        this.answerService = service;
    }

    @Autowired
    public TicketAnswerController(TicketAnswerService service) {
        this.answerService = service;
    }

    @Autowired
    private AttachmentsService attachmentsService;

    public void setFileService(AttachmentsService service) {
        this.attachmentsService = service;
    }

    @Autowired
    private TicketService ticketService;
    
    public void setTicketService(TicketService service) {
        this.ticketService = service;
    }

    @Autowired
    private UserService userService;
    
    public void setUserService(UserService service) {
        this.userService = service;
    }

    @Autowired
    private EmailService emailService;

    public void setEmailService(EmailService service) {
        this.emailService = service;
    }
    
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    Iterable<TicketAnswer> findAll() {
        return answerService.findAll();
    }

    @RequestMapping(value = {"", "/{id}"}, method = {RequestMethod.PUT, RequestMethod.POST})
    @ResponseBody
    public TicketAnswer save(@RequestBody String ticketAnwString) throws ParseException, IOException {

        JSONObject jSONObject = new JSONObject(ticketAnwString);

        Long ticketId = jSONObject.getLong("ticketId");
        Long userId = jSONObject.getLong("userId");
        String respostaString = jSONObject.getString("description");
        return saveNewAnswer(ticketId, userId, respostaString);
    }

    public TicketAnswer saveNewAnswer(Long idTicket, Long userId, String answerDescription) throws ParseException, IOException {

        List<String> emails = new ArrayList<String>();

        Ticket ticket = ticketService.findById(idTicket);
        User userAnswer = userService.findById(userId);

        List<File> filesToSave = attachmentsService.getAttachmentsFromUser(userAnswer.getUserName());

        TicketAnswer answer = new TicketAnswer();

        answer.setDescription(answerDescription);
        answer.setTicket(ticket);
        answer.setUser(userAnswer);
        answer.setDateCreation(new Date());
        answer = answerService.save(answer);
        
        ticket.setLastInteration(answer.getDateCreation());
        ticket.setUserLastInteration(answer.getUser());
        ticketService.save(ticket);
        
        Attachments attachment = null;
        for (File file : filesToSave) {
            //file.renameTo(file.getName().replace(username, username));
            attachment = new Attachments();
            attachment.setName(file.getName());
            attachment.setByteArquivo(attachmentsService.getBytesFromFile(file));
            attachment.setTicketAnswer(answer);
            attachmentsService.save(attachment);
            file.delete();
        }
        
        emails = emailService.getListEmailsToSend(null, null, answer);
        
        if(emails.size()>0){
            String subjectString = "Nova Resposta ao Ticket #" + answer.getTicket().getId() + "#: " + answer.getTicket().getTitle();
            String contentString = emailService.contentNewAnswer(answer, userAnswer.getName());
            emailService.sendEmail(emails,subjectString,contentString,Consts.DEFAULT);
        }

        return answer;
    }

    @RequestMapping(value = "/find-by-ticket/{ticketId}", method = RequestMethod.GET)
    public @ResponseBody
    List<TicketAnswer> findAnswersByTicket(@PathVariable String ticketId) {
        Ticket ticket = ticketService.findById(Long.parseLong(ticketId));
        return answerService.findAnswersByTicket(ticket);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Entidade não encontrada")
    public void handleEntityNotFoundException(Exception ex) {
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public void handleDataIntegrityViolationException(DataIntegrityViolationException ex, HttpServletResponse response) throws IOException {
        response.sendError(HttpServletResponse.SC_FORBIDDEN, ex.getMessage());
    }
}
