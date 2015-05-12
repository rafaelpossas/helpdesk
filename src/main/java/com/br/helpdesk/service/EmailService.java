/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.service;

import com.Consts;
import com.br.helpdesk.controller.TicketAnswerController;
import com.br.helpdesk.model.EmailConfig;
import com.br.helpdesk.model.Ticket;
import com.br.helpdesk.model.TicketAnswer;
import com.br.helpdesk.model.User;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
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
import javax.mail.search.FlagTerm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Andre
 */
@Service
public class EmailService {

    public Properties PROPERTIES;

    @Autowired
    private UserService userService;

    public void setUserService(UserService service) {
        this.userService = service;
    }

    @Autowired
    private TicketAnswerController answerController;

    @Autowired
    private EmailConfigService emailConfigService;

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

    private Session getSession(String type) {
        setEmailProperties(type);
        Session session = Session.getDefaultInstance(PROPERTIES, new javax.mail.Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                String username = PROPERTIES.getProperty(Consts.USER_EMAIL);
                String password = PROPERTIES.getProperty(Consts.MAIL_PASSWORD);
                return new PasswordAuthentication(username, password);
            }
        });
        return session;
    }

    public void setEmailProperties(String type) {
        PROPERTIES = new Properties();
        EmailConfig emailConfig = emailConfigService.findById(1L);
        
        if (type.equals(Consts.MARKETING)) {
            PROPERTIES.put(Consts.SMTP_HOST, emailConfig.getMarketingSmtpHost());
            PROPERTIES.put(Consts.USER_EMAIL, emailConfig.getMarketingUserEmail());
            PROPERTIES.put(Consts.MAIL_PASSWORD, emailConfig.getMarketingPassword());
        } else {
            PROPERTIES.put(Consts.SMTP_HOST, emailConfig.getSmtpHost());
            PROPERTIES.put(Consts.USER_EMAIL, emailConfig.getUserEmail());
            PROPERTIES.put(Consts.MAIL_PASSWORD, emailConfig.getPassword());
            PROPERTIES.put(Consts.IMAP, emailConfig.getImap());
            PROPERTIES.put(Consts.MAIL_IMAPS, Consts.IMAPS);
            PROPERTIES.put(Consts.FOLDER, Consts.INBOX);
        }
        PROPERTIES.put(Consts.SOCKET_FACTORY_PORT, emailConfig.getSocketFactoryPort());
        PROPERTIES.put(Consts.AUTH, emailConfig.getAuth());
        PROPERTIES.put(Consts.SMTP_PORT, emailConfig.getSmtpPort());
        PROPERTIES.put(Consts.SOCKET_FACTORY_CLASS, Consts.SOCKET_FACTORY_CLASS_VALUE);
        PROPERTIES.put(Consts.MAIL_TRANSPORT_PROTOCOL, Consts.SMTP);
        PROPERTIES.put(Consts.MAIL_SMTP_STARTTLS_ENABLE, Consts.TRUE);
        PROPERTIES.put(Consts.MAIL_SMTP_SOCKETFACTORY_FALLBACK, Consts.FALSE);
    }

    public void sendEmail(List<String> listEmailsTo, String subject, String content, String serverType) throws MessagingException {
        Session session = getSession(serverType);
        String emails = getCorrectAdress(listEmailsTo);
        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(PROPERTIES.getProperty(Consts.USER_EMAIL)));
            message.setRecipients(Message.RecipientType.BCC, InternetAddress.parse(emails));
            message.setSubject(subject);
            message.setContent(content, "text/html; charset=utf-8");

            Transport.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    /**
     * Body do email a ser enviado quando um novo ticket é criado.
     * 
     * @author André Sulivam
     * @param ticket
     * @return 
     */
    public String contentNewTicket(Ticket ticket) {
        String fullEmail = Consts.REPLY_ABOVE_THIS_LINE + contentDefaultEmailTop()
                + "<b>"+ticket.getUser().getName()+"</b> criou o ticket n. <b>"+ticket.getId()+" \""+ticket.getTitle()+"\"</b> na categoria <b>"+ticket.getCategory().getName()+"</b>:"
                + "<br><br>"
                + ticket.getDescription()
                + "<br>"
                + contentDefaultEmailBot();
        return fullEmail;
    }

    /**
     * Body do email a ser enviado quando um ticket for editado.
     * 
     * @author André Sulivam
     * @param olderTicket
     * @param newTicket
     * @return 
     */
    public String contentEditTicket(Ticket olderTicket, Ticket newTicket) {

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
        if (olderTicket.getStepsTicket() != null) {
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
        if (newTicket.getStepsTicket() != null) {
            newSteps = newTicket.getStepsTicket();
        }

        boolean changeCategory = !(olderCategoryName.equals(newCategoryName));
        boolean changeEstimateTime = !(olderEstimatedTime.equals(newEstimatedTime));
        boolean changePriority = !(olderPriority.equals(newPriority));
        boolean changeResponsible = !(olderResponsible.equals(newResponsible));
        boolean changeSteps = !(olderSteps.equals(newSteps));

        String fullEmail = Consts.REPLY_ABOVE_THIS_LINE + contentDefaultEmailTop()
                + "O ticket n. <b>"+olderTicket.getId()+" \""+olderTicket.getTitle()+"\"</b> "+"foi editado:<br>";

        if (changeCategory) {
            fullEmail += "<br>Categoria passou de: <b>"+olderCategoryName+"</b> para: <b>"+newCategoryName+"</b>";
        }
        if (changeEstimateTime) {
            fullEmail += "<br>Prazo estimado passou de: <b>"+olderEstimatedTime+"</b> para: <b>"+newEstimatedTime+"</b>";
        }
        if (changePriority) {
            fullEmail += "<br>Prioridade passou de: <b>"+olderPriority+"</b></b> para: <b>"+newPriority+"</b>";
        }
        if (changeResponsible) {
            fullEmail += "<br>Responsável passou de: <b>"+olderResponsible+"</b> para: <b>"+newResponsible+"</b>";
        }
        if(changeSteps) {
            fullEmail += "<br>Passos para reproduzir o erro passou de: <b>"+olderSteps+"</b> para: <b>"+newSteps+"</b>";
        }

        fullEmail += "<br>"+contentDefaultEmailBot();
        return fullEmail;
    }

    /**
     * Body do email a ser enviado quando uma nova resposta for gerada.
     * 
     * @author André Sulivam
     * @param answer
     * @param userName
     * @return 
     */
    public String contentNewAnswer(TicketAnswer answer, String userName) {
        long idTicket = answer.getTicket().getId();
        String description = answer.getDescription();

        String fullEmail = Consts.REPLY_ABOVE_THIS_LINE + contentDefaultEmailTop()
                + "<b>"+answer.getUser().getName()+"</b> respondeu ao ticket n. <b>"+idTicket+" \""+answer.getTicket().getTitle()+"\"</b>:"
                + "<br><br>"
                + description
                + "<br>"
                + contentDefaultEmailBot();
        return fullEmail;
    }

    /**
     * Body do email a ser enviado quando um ticket for fechado.
     * 
     * @author André Sulivam
     * @param ticket
     * @param user
     * @return 
     */
    public String contentCloseTicket(Ticket ticket, User user) {
        String fullEmail = Consts.REPLY_ABOVE_THIS_LINE + contentDefaultEmailTop()
                + "<b>"+user.getName()+"</b> encerrou o ticket n. <b>"+ticket.getId()+" \""+ticket.getTitle()+"\"</b>."
                + "<br>"
                + contentDefaultEmailBot();
        return fullEmail;
    }

    /**
     * Body do email a ser enviado quando um ticket for reaberto.
     * 
     * @author André Sulivam
     * @param ticket
     * @param user
     * @return 
     */
    public String contentReOpenTicket(Ticket ticket, User user) {
        String fullEmail = Consts.REPLY_ABOVE_THIS_LINE + contentDefaultEmailTop()
                + "<b>"+user.getName()+"</b> reabriu o ticket n. <b>"+ticket.getId()+" \""+ticket.getTitle()+"\"</b>."
                + "<br>"
                + contentDefaultEmailBot();
        return fullEmail;
    }

    /**
     * Cria um String concatenada com os emails enviados na lista, separados por vírgula.
     * 
     * @author André Sulivam
     * @param listEmails
     * @return 
     */
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
        Session session = getSession(Consts.DEFAULT);
        Store store = null;
        try {
            // Set the store depending on the parameter flag value
            store = session.getStore(PROPERTIES.getProperty(Consts.MAIL_IMAPS));
            // Set the server depending on the parameter flag value            
            //VALORES DO SERVIDOR
            store.connect(PROPERTIES.getProperty(Consts.IMAP), PROPERTIES.getProperty(Consts.USER_EMAIL), PROPERTIES.getProperty(Consts.MAIL_PASSWORD));

            // Get the Inbox folder
            Folder inbox = store.getFolder(PROPERTIES.getProperty(Consts.FOLDER));
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
            if (store != null) {
                store.close();
            }
            e.printStackTrace();
        }
    }

    /**
     * Retorna lista de emails de todos os usuários que deverão receber o email. A lista varia pela situação. <br>
     * Caso seja um novo ticket, a lista será de todos os administradores. <br>
     * Caso seja edição de ticket, a lista será de todos os usuários envolvidos com aquele ticket. <br>
     * Caso seja uma nova resposta,  a lista será de todos os usuários envolvidos com aquele ticket. <br>
     * 
     * @author André Sulivam
     * @param olderTicket
     * @param newTicket
     * @param ticketAnswer
     * @return 
     */
    public List<String> getListEmailsToSend(Ticket olderTicket, Ticket newTicket, TicketAnswer ticketAnswer) {
        List<String> listEmails = new ArrayList<String>();
        User userAnswer;

        User userTicket;

        User userResponsible;
        User userResponsibleNew;

        if (ticketAnswer != null) {
            // usuario que enviou a resposta.
            userAnswer = ticketAnswer.getUser();
            // usuario que criou o ticket.
            userTicket = ticketAnswer.getTicket().getUser();
            // usuario responsavel pelo ticket.
            userResponsible = ticketAnswer.getTicket().getResponsible();

            // se for email para uma nova resposta.
            if (userAnswer != null) {
                if (userTicket != null) {
                    // verifica se não foi o usuario que criou o ticket que enviou a resposta.
                    if (!userAnswer.getId().equals(userTicket.getId())) {
                        // valida email do usuário que criou o ticket.
                        if (userTicket.getEmail() != null && !(userTicket.getEmail().equals(""))) {
                            listEmails.add(userTicket.getEmail());
                        }
                    }
                }
                if (userResponsible != null) {
                    // verifica se não foi o responsável do ticket que mandou a resposta.
                    if (!userAnswer.getId().equals(userResponsible.getId())) {
                        // valida email do responsável do ticket.
                        if (userResponsible.getEmail() != null && !(userResponsible.getEmail().equals(""))) {
                            listEmails.add(userResponsible.getEmail());
                        }
                    }
                }
            }
        } else {
            // se for email para novo ticket ou mudanças em ticket antigo.

            // se for edição de ticket.
            if (olderTicket != null) {

                // usuario criador do ticket.
                userTicket = olderTicket.getUser();
                // usuario responsavel antes da edicao do ticket.
                userResponsible = olderTicket.getResponsible();
                // usuario responsavel apos a edicao do ticket.
                userResponsibleNew = newTicket.getResponsible();

                if (userTicket != null) {
                    // validando email do usuario.
                    if (userTicket.getEmail() != null && !(userTicket.getEmail().equals(""))) {
                        listEmails.add(userTicket.getEmail());
                    }
                }

                if (userResponsible != null) {
                    // valida o email do responsável do ticket.
                    if (userResponsible.getEmail() != null && !(userResponsible.getEmail().equals(""))) {
                        listEmails.add(userResponsible.getEmail());
                    }
                    if (userResponsibleNew != null) {
                        // verifica se não manteve o mesmo responsavel do ticket.
                        if (!userResponsibleNew.getId().equals(userResponsible.getId())) {
                            listEmails.add(userResponsibleNew.getEmail());
                        }
                    }
                } else if (userResponsibleNew != null) {
                    // valida o email do novo responsável do ticket.
                    if (userResponsibleNew.getEmail() != null && !(userResponsibleNew.getEmail().equals(""))) {
                        listEmails.add(userResponsibleNew.getEmail());
                    }
                }
            } else if (newTicket != null) {
                // caso seja novo ticket, mandar email a todos os administradores.
                listEmails.addAll(getAdminEmails());
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
            if (admin.getEmail() != null && !(admin.getEmail().equals(""))) {
                listEmails.add(admin.getEmail());
            }
        }
        return listEmails;
    }

    /**
     * Body do email a ser enviado quando um usuário solicitar recuperação de senha. 
     * 
     * @author Ricardo
     * @update André Sulivam
     * @param user
     * @param language
     * @throws MessagingException 
     */
    public void sendEmailPasswordChanged(User user, String language) throws MessagingException {

        String html = "";
        //Define o idioma do email
        if (language.trim().equals("pt_BR")) {
            html = contentDefaultEmailTop()
                    + "<p> Prezado " + user.getName() + ",</p>"
                    + "<br/>"
                    + "<p> Uma nova senha foi gerada para seu acesso ao sistema.</p>"
                    + "<p> Aconselhamos que altere a mesma para uma de sua preferência pois trata-se de uma senha temporária.</p>"
                    + "<p> Sua nova senha é: <b>" + user.getPassword() + "</b></p>"
                    + "<p> Link para acesso: <a href='http://cymosupport.tecnologia.ws/Helpdesk'> http://cymosupport.tecnologia.ws/Helpdesk </a> </p>"
                    + "<p>Atenciosamente,</p>"
                    + contentDefaultEmailBot();
        } else if (language.trim().equals("en")) {
            html = contentDefaultEmailTop()
                    + "<p> Dear " + user.getName() + ",</p>"
                    + "<br/>"
                    + "<p> A new password was generated for you access in the system.</p>"
                    + "<p> We strongly recommend you to change the password to one of your preference.</p>"
                    + "<p> Your new password is: <b>" + user.getPassword() + "</b></p>"
                    + "<p> Link for the access: <a href='http://cymosupport.tecnologia.ws/Helpdesk'> http://cymosupport.tecnologia.ws/Helpdesk </a> </p>"
                    + "<p>Att,</p>"
                    + contentDefaultEmailBot();
        }

        List<String> emails = new ArrayList<String>();
        emails.add(user.getEmail());
        String subject = "";
        if (language.trim().equals("pt_BR")) {
            subject = "Alerta de alteração de senha";
        } else if (language.trim().equals("en")) {
            subject = "Password recovery";
        }
        sendEmail(emails, subject, html, Consts.DEFAULT);
    }

    /**
     * Método que recebe o texto escrito na tela de Enviar Email do sistema para os usuários selecionados. 
     * 
     * @author André Sulivam
     * @param subject
     * @param text
     * @param listEmails
     * @throws MessagingException 
     */
    public void sendEmailByScreenConfiguration(String subject, String text, List<String> listEmails) throws MessagingException {
        sendEmail(listEmails, subject, text, Consts.MARKETING);
    }

    /**
     * Content com a parte default superior do email.
     *
     * @author André Sulivam
     * @return
     */
    public String contentDefaultEmailTop() {
        String email = "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<meta charset='UTF-8\'>"
                + "<style>"
                + "pre{color:black;font-size: 15px;font-weight: normal;}"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<br><br>";
        return email;
    }

    /**
     * Content com a parte default inferior do email.
     *
     * @author André Sulivam
     * @return
     */
    public String contentDefaultEmailBot() {
        String email = "<br>"
                + "<h4><b>"
                + Consts.CYMO_GESTAO_PERFOMANCE
                + "</b></h4>"
                + "</body>"
                + "</html> --#";
        return email;
    }

}
