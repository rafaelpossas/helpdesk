/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.service;

import com.Consts;
import com.br.helpdesk.controller.TicketAnswerController;
import com.br.helpdesk.model.Ticket;
import com.br.helpdesk.model.TicketAnswer;
import com.br.helpdesk.model.User;
import com.br.helpdesk.util.EmailPropertiesLoader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.mail.Address;
import javax.mail.Flags;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Part;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Store;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.search.FlagTerm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Andre
 */
@Service
public class EmailService {

    public static int EMAIL_NEW_TICKET = 0;
    public static int EMAIL_NEW_ANSWER = 1;
    public static int EMAIL_CHANGES = 2;

    public static Properties PROPERTIES = EmailPropertiesLoader.propertiesLoader();

    @Autowired
    private UserService userService;

    public void setUserService(UserService service) {
        this.userService = service;
    }

    @Autowired
    private TicketAnswerController answerController;
    
    /**
     * Return the primary text content of the message.
     */
    private String getText(Part p) throws
            MessagingException, IOException {
        boolean textIsHtml = false;
        if (p.isMimeType("text/*")) {
            String s = (String) p.getContent();
            textIsHtml = p.isMimeType("text/html");
            return s;
        }

        if (p.isMimeType("multipart/alternative")) {
            // prefer html text over plain text
            Multipart mp = (Multipart) p.getContent();
            String text = null;
            for (int i = 0; i < mp.getCount(); i++) {
                Part bp = mp.getBodyPart(i);
                if (bp.isMimeType("text/plain")) {
                    if (text == null) {
                        text = getText(bp);
                    }
                    continue;
                } else if (bp.isMimeType("text/html")) {
                    String s = getText(bp);
                    if (s != null) {
                        return s;
                    }
                } else {
                    return getText(bp);
                }
            }
            return text;
        } else if (p.isMimeType("multipart/*")) {
            Multipart mp = (Multipart) p.getContent();
            for (int i = 0; i < mp.getCount(); i++) {
                String s = getText(mp.getBodyPart(i));
                if (s != null) {
                    return s;
                }
            }
        }

        return null;
    }

    private Session getSession() {        
        Session session = Session.getDefaultInstance(PROPERTIES, new javax.mail.Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(PROPERTIES.getProperty("mail.user"), PROPERTIES.getProperty("mail.password"));
            }
        });
        return session;
    }

    public void sendEmail(Ticket ticket, Ticket newTicket, TicketAnswer answer, User userAnswer, List<String> listEmailsTo, Integer sendType){
        Session session = getSession();
        String emails = getCorrectAdress(listEmailsTo);
        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(PROPERTIES.getProperty("mail.user")));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(emails));
            Long ticketId = 0L;
            String ticketTitle = "";
            String subjectString = "";
            String contentString = "";
            if(ticket != null){
                ticketId = ticket.getId();
                ticketTitle = ticket.getTitle();
            }
            
            if(sendType == Consts.TICKET_NEW){
                subjectString = "Novo Ticket #"+ticketId+"#: "+ticketTitle;
                contentString = contentNewTicket(ticket);
            }
            else if(sendType == Consts.TICKET_EDIT){
                subjectString = "Atualização do Ticket #"+ticketId+"#: "+ticketTitle;
                contentString = contentEditTicket(ticket, newTicket);
            }
            else if(sendType == Consts.TICKET_NEW_ANSWER){
                subjectString = "Nova Resposta ao Ticket #"+answer.getTicket().getId()+"#: "+answer.getTicket().getTitle();
                contentString = contentNewAnswer(answer, userAnswer.getName());
            }
            else if(sendType == Consts.TICKET_CLOSE){
                subjectString = "Encerramento do Ticket #"+ticketId+"#: "+ticketTitle;
                contentString = contentCloseTicket(ticketId, ticketTitle);
            }
            else if(sendType == Consts.TICKET_OPEN){
                subjectString = "Reabertura do Ticket #"+ticketId+"#: "+ticketTitle;
                contentString = contentOpenTicket(ticketId, ticketTitle);
            }
            message.setSubject(subjectString);
            message.setContent(contentString, "text/html; charset=utf-8");
            
            Transport.send(message);

        } catch (MessagingException e) {}
    }

    private String contentNewTicket(Ticket ticket) {
        String assunto = ticket.getTitle();
        String categoria = ticket.getCategory().getName();
        String observacoes = ticket.getDescription();
        String passos = ticket.getStepsTicket();
        
        String html = Consts.REPLY_ABOVE_THIS_LINE+"<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<meta charset='UTF-8\'>"
                + "<style>"
                + "h1{font-weight: bold;}"
                + "pre{color:black;font-size: 15px;font-weight: normal;}"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<h1> NOVO TICKET CRIADO </h1>"
                + "<HR>"
                + "<table>"
                + "<tr>"
                + "<th><h3>ASSUNTO:&nbsp;</h3></th>"
                + "<th><pre>" + assunto + "</pre></th>"
                + "</tr>"
                + "</table>"
                + "<HR>"
                + "<table>"
                + "<tr>"
                + "<th><h3>CATEGORIA:&nbsp;</h3></th>"
                + "<th><pre>" + categoria + "</pre></th>"
                + "</tr>"
                + "</table>"
                + "<HR>"
                + "<table>"
                + "<tr>"
                + "<th><h3>PASSOS PARA REPRODUZIR:&nbsp;</h3></th>"
                + "<th><pre>" + passos + "</pre></th>"
                + "</tr>"
                + "</table>"
                + "<HR>"
                + "<table>"
                + "<tr>"
                + "<th><h3>OBSERVAÇÕES:&nbsp;</h3></th>"
                + "<th><pre>" + observacoes + "</pre></th>"
                + "</tr>"
                + "</table>"
                + "<h4>"
                + "Cymo Tecnologia em Gestão"
                + "</h4>"
                + "</body>"
                + "</html> --#";
        return html;
    }

    private String contentEditTicket(Ticket olderTicket, Ticket newTicket) {
        String olderCategoryName = Consts.NO_CATEGORY;
        String newCategoryName = Consts.NO_CATEGORY;
        String olderEstimatedTime = Consts.NO_ESTIMATED_TIME;
        String newEstimatedTime = Consts.NO_ESTIMATED_TIME;
        String olderPriority = Consts.NO_PRIORITY;
        String newPriority = Consts.NO_PRIORITY;
        String olderResponsible = Consts.NO_RESPONSIBLE;
        String newResponsible = Consts.NO_RESPONSIBLE;
        String olderSteps = Consts.NO_STEPS;
        String newSteps = Consts.NO_STEPS;

        if (olderTicket.getCategory() != null) {
            olderCategoryName = olderTicket.getCategory().getName();
        }
        if (olderTicket.getEstimateTime() != null) {
            olderEstimatedTime = olderTicket.getEstimateTime().toString();
        }
        if (olderTicket.getPriority() != null) {
            olderPriority = olderTicket.getPriority().getName();
        }
        if (olderTicket.getResponsible() != null) {
            olderResponsible = olderTicket.getResponsible().getName();
        }
        if(olderTicket.getStepsTicket() != null){
            olderSteps = olderTicket.getStepsTicket();
        }

        if (newTicket.getCategory() != null) {
            newCategoryName = newTicket.getCategory().getName();
        }
        if (newTicket.getEstimateTime() != null) {
            newEstimatedTime = newTicket.getEstimateTime().toString();
        }
        if (newTicket.getPriority() != null) {
            newPriority = newTicket.getPriority().getName();
        }
        if (newTicket.getResponsible() != null) {
            newResponsible = newTicket.getResponsible().getName();
        }
        if(newTicket.getStepsTicket() != null){
            newSteps = newTicket.getStepsTicket();
        }

        String html = "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<meta charset='UTF-8\'>"
                + "<style>"
                + "h1{font-weight: bold;}"
                + "pre{color:black;font-size: 15px;font-weight: normal;}"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<h1> TICKET EDITADO </h1>"
                + "<HR>"
                + "<table>"
                + "<tr>"
                + "<th><h3>TICKET:&nbsp;</h3></th>"
                + "<th><pre>" + "#" + newTicket.getId() + " - " + newTicket.getDescription() + "</pre></th>"
                + "</tr>"
                + "</table>"
                + "<HR>"
                + "<table>"
                + "<tr>"
                + "<th><h3>CATEGORIA ANTIGA:&nbsp;</h3></th>"
                + "<th><pre>" + olderCategoryName + "</pre></th>"
                + "</tr>"
                + "<tr>"
                + "<th><h3>CATEGORIA NOVA:&nbsp;</h3></th>"
                + "<th><pre>" + newCategoryName + "</pre></th>"
                + "</tr>"
                + "</table>"
                + "<HR>"
                + "<table>"
                + "<tr>"
                + "<th><h3>PRAZO ANTIGO:&nbsp;</h3></th>"
                + "<th><pre>" + olderEstimatedTime + "</pre></th>"
                + "</tr>"
                + "<tr>"
                + "<th><h3>PRAZO NOVO:&nbsp;</h3></th>"
                + "<th><pre>" + newEstimatedTime + "</pre></th>"
                + "</tr>"
                + "</table>"
                + "<HR>"
                + "<table>"
                + "<tr>"
                + "<th><h3>PRIORIDADE ANTIGA:&nbsp;</h3></th>"
                + "<th><pre>" + olderPriority + "</pre></th>"
                + "</tr>"
                + "<tr>"
                + "<th><h3>PRIORIDADE NOVA:&nbsp;</h3></th>"
                + "<th><pre>" + newPriority + "</pre></th>"
                + "</tr>"
                + "</table>"
                + "<HR>"
                + "<table>"
                + "<tr>"
                + "<th><h3>RESPONSÁVEL ANTIGO:&nbsp;</h3></th>"
                + "<th><pre>" + olderResponsible + "</pre></th>"
                + "</tr>"
                + "<tr>"
                + "<th><h3>RESPONSÁVEL NOVO:&nbsp;</h3></th>"
                + "<th><pre>" + newResponsible + "</pre></th>"
                + "</tr>"
                + "</table>"
                + "<HR>"
                + "<table>"
                + "<tr>"
                + "<th><h3>PASSOS PARA REPRODUÇÃO ANTIGO:&nbsp;</h3></th>"
                + "<th><pre>" + olderSteps + "</pre></th>"
                + "</tr>"
                + "<tr>"
                + "<th><h3>PASSOS PARA REPRODUÇÃO NOVO:&nbsp;</h3></th>"
                + "<th><pre>" + newSteps + "</pre></th>"
                + "</tr>"
                + "</table>"
                + "<h4>"
                + "Cymo Tecnologia em Gestão"
                + "</h4>"
                + "</body>"
                + "</html>";

        return html;
    }

    private String contentNewAnswer(TicketAnswer answer, String userName) {
        long idTicket = answer.getTicket().getId(); 
        String nameTicket = answer.getTicket().getDescription(); 
        String description = answer.getDescription();
        String html = Consts.REPLY_ABOVE_THIS_LINE+"<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<meta charset='UTF-8\'>"
                + "<style>"
                + "h1{font-weight: bold;}"
                + "pre{color:black;font-size: 15px;font-weight: normal;}"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<h1> NOVA RESPOSTA CRIADA </h1>"
                + "<table>"
                + "<tr>"
                + "<th><h3>TICKET:&nbsp;</h3></th>"
                + "<th><pre>" + "#" + idTicket + " - " + nameTicket + "</pre></th>"
                + "</tr>"
                + "</table>"
                + "<table>"
                + "<tr>"
                + "<th><h3>CRIADA POR:&nbsp;</h3></th>"
                + "<th><pre>" + userName + "</pre></th>"
                + "</tr>"
                + "</table>"
                + "<table>"
                + "<tr>"
                + "<th><h3>RESPOSTA:&nbsp;</h3></th>"
                + "<th><pre>" + description + "</pre></th>"
                + "</tr>"
                + "</table>"
                + "<br>"
                + "<h4>"
                + "Cymo Tecnologia em Gestão"
                + "</h4>"
                + "</body>"
                + "</html>";
        return html;
    }

    private String contentCloseTicket(long idTicket, String nameTicket) {
        String html = Consts.REPLY_ABOVE_THIS_LINE+"<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<meta charset='UTF-8\'>"
                + "<style>"
                + "h1{font-weight: bold;}"
                + "pre{color:black;font-size: 15px;font-weight: normal;}"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<h1> TICKET ENCERRADO </h1>"
                + "<table>"
                + "<tr>"
                + "<th><h3>TICKET #" + idTicket + "#: " + nameTicket + "</h3></th>"
                + "</tr>"
                + "</table>"
                + "<br>"
                + "<h4>"
                + "Cymo Tecnologia em Gestão"
                + "</h4>"
                + "</body>"
                + "</html>";
        return html;
    }
    
    private String contentOpenTicket(long idTicket, String nameTicket) {
        String html = Consts.REPLY_ABOVE_THIS_LINE+"<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<meta charset='UTF-8\'>"
                + "<style>"
                + "h1{font-weight: bold;}"
                + "pre{color:black;font-size: 15px;font-weight: normal;}"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<h1> TICKET REABERTO </h1>"
                + "<table>"
                + "<tr>"
                + "<th><h3>TICKET #" + idTicket + "#: " + nameTicket + "</h3></th>"
                + "</tr>"
                + "</table>"
                + "<br>"
                + "<h4>"
                + "Cymo Tecnologia em Gestão"
                + "</h4>"
                + "</body>"
                + "</html>";
        return html;
    }
    
    public String getCorrectAdress(List<String> listEmails) {
        String emails = "";
        for (int i = 0; i < listEmails.size(); i++) {
            if (i != 0) {
                emails += ",";
            }
            emails += listEmails.get(i);
        }
        return emails;
    }

    /**
     * Method reads emails from the IMAP or POP3 server.
     */
    public void readEmails() throws MessagingException {
        // Create the session        
        Session session = getSession();
        Store store = null;
        try {
            // Set the store depending on the parameter flag value
            store = session.getStore(PROPERTIES.getProperty("mail.imaps"));
            // Set the server depending on the parameter flag value            
            //VALORES DO SERVIDOR
            store.connect(PROPERTIES.getProperty("mail.imap.gmail"), PROPERTIES.getProperty("mail.user"), PROPERTIES.getProperty("mail.password"));

            // Get the Inbox folder
            Folder inbox = store.getFolder(PROPERTIES.getProperty("mail.folder"));
            // Set the mode to the read-write mode
            inbox.open(Folder.READ_WRITE);

            // Get messages not seen
            FlagTerm ft = new FlagTerm(new Flags(Flags.Flag.SEEN), false);
            Message messages[] = inbox.search(ft);

            // Display the messages
            for (Message message : messages) {

                //Recebe o id do ticket se for resposta de tickets já criados.
                String[] ss;
                long idTicket = 0;
                ss = message.getSubject().split("\\#");
                if (ss.length > 1) {
                    ss = ss[1].split("\\#");
                    idTicket = Long.parseLong(ss[0]);
                }

                //Recebe o remetente do e mail
                String email = ((InternetAddress) ((Address) (message.getFrom()[0]))).getAddress();

                if (message.getContent() instanceof Multipart) {
                    Multipart mp = (Multipart) message.getContent();
                    for (int i = 0, n = mp.getCount(); i < n; i++) {
                        //handlePart(mp.getBodyPart(i));
                        String contentType = mp.getBodyPart(i).getContentType();
                        if ((contentType.length() >= 10) && (contentType.toLowerCase().substring(0, 10).equals("text/plain"))) {
                            String body = getText(mp.getBodyPart(i));
                            String[] split = body.split("##Responda acima desta linha##");
                            String answer = split[0];
                            answer = answer.trim();
                            if (!answer.equals("") && !email.equals("")) {
                                User user = userService.findByEmail(email);
                                if (user != null) {
                                    answerController.saveNewAnswer(idTicket, user.getId(), answer);
                                }
                            }
                        }
                    }
                }
            }
            store.close();
        } catch (Exception e) {
            if(store != null){
                store.close();
            }
            e.printStackTrace();
        }
    }

    public List<String> getListEmailsToSend(Ticket ticket, Ticket newTicket, TicketAnswer ticketAnswer) {
        List<String> listEmails = new ArrayList<String>();
        User userAnswer;
        User userTicket;
        User userResponsible;
        User userTicketNew;
        User userResponsibleNew;
        
        if (ticket != null) {
            userTicket = ticket.getUser();
            userResponsible = ticket.getResponsible();
            
            listEmails.add(userTicket.getEmail());
            if(userResponsible == null){
                listEmails.addAll(getAdminEmails());
            }
            else{
                listEmails.add(userResponsible.getEmail());
            }  
        }
        if (newTicket != null) {
            userTicketNew = newTicket.getUser();
            userResponsibleNew = newTicket.getResponsible();
            
            listEmails.add(userTicketNew.getEmail());
            if(userResponsibleNew == null){
                listEmails.addAll(getAdminEmails());
            }
            else{
                listEmails.add(userResponsibleNew.getEmail());
            }
        }
        else if (ticketAnswer != null) {
            userAnswer = ticketAnswer.getUser();
            userTicket = ticketAnswer.getTicket().getUser();
            userResponsible = ticketAnswer.getTicket().getResponsible();
            
            listEmails.add(userAnswer.getEmail());
            listEmails.add(userTicket.getEmail());
            if(userResponsible == null){
                listEmails.addAll(getAdminEmails());
            }
            else{
                listEmails.add(userResponsible.getEmail());
            }            
        }
        
        return listEmails;
    }
    /**
     * @author andresulivam
     *
     * Lista com email de todos os admins do sistema.
     * @return
     */
    public List<String> getAdminEmails() {
        List<String> listEmails = new ArrayList<String>();
        List<User> listAdmin = userService.findByUserAdmin();
        for (User admin : listAdmin) {
            listEmails.add(admin.getEmail());
        }
        return listEmails;
    }
    
    public void sendEmailPasswordChanged(User user,String language){
        
        String html = "";
        //Define o idioma do email
        if(language.trim().equals("pt_BR")){
            html = "<!DOCTYPE html>"
                + "<html>"
                    + "<head>"
                        + "<meta charset='UTF-8\'>"
                        + "<style>"
                        + "h1{font-weight: bold;}"
                        + "pre{color:black;font-size: 15px;font-weight: normal;}"
                        + "</style>"
                    + "</head>"
                    + "<body>"
                        +"<p> Prezado "+user.getName()+",</p>"
                        +"<br/>"                       
                        +"<p> Uma nova senha foi gerada para seu acesso ao sistema.</p>"                        
                        +"<p> Aconselhamos que altere a mesma para uma de sua preferência pois trata-se de uma senha temporária.</p>"                        
                        +"<p> Sua nova senha é: "+user.getPassword()+"</p>"
                        +"<p> Link para acesso: <a href='http://cymosupport.tecnologia.ws/Helpdesk'> http://cymosupport.tecnologia.ws/Helpdesk </a> </p>"
                        +"<p>Atenciosamente, <br/>Cymo</p>"                        
                    + "</body>"
                + "</html>";
        }else if(language.trim().equals("en")){
            html = "<!DOCTYPE html>"
                + "<html>"
                    + "<head>"
                        + "<meta charset='UTF-8\'>"
                        + "<style>"
                        + "h1{font-weight: bold;}"
                        + "pre{color:black;font-size: 15px;font-weight: normal;}"
                        + "</style>"
                    + "</head>"
                    + "<body>"
                        +"<p> Dear "+user.getName()+",</p>"
                        +"<br/>" 
                        +"<p> A new password was generated for you access in the system.</p>" 
                        +"<p> We strongly recommend you to change the password to one of your preference.</p>"                        
                        +"<p> Your new password is: "+user.getPassword()+"</p>"
                        +"<p> Link for the access: <a href='http://cymosupport.tecnologia.ws/Helpdesk'> http://cymosupport.tecnologia.ws/Helpdesk </a> </p>"
                        +"<p>Att, <br/>Cymo</p>"                        
                    + "</body>"
                + "</html>";
        }
        
        Session session = getSession();
        try {
            
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(PROPERTIES.getProperty("mail.user")));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(user.getEmail()));
            if(language.trim().equals("pt_BR")){
                message.setSubject("Alerta de alteração de senha");
            }else if(language.trim().equals("en")){
                message.setSubject("Password recovery");
            }            
            message.setContent(html, "text/html; charset=utf-8");
            Transport.send(message);
            
        } catch (MessagingException e) {
        }
        
        
        
    }

}
