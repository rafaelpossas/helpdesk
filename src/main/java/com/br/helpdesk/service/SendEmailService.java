/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.service;

import com.br.helpdesk.model.User;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Resource;
import javax.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author SULIVAM
 */
@Service
public class SendEmailService {

    @Resource
    private UserService userService;

    public void setUserService(UserService service) {
        this.userService = service;
    }

    @Autowired
    private EmailService emailService;

    public void setEmailService(EmailService service) {
        this.emailService = service;
    }

    /**
     * Método para criar um Json com os emails dos usuários que receberão o
     * email criado.
     *
     * @param groupClient
     * @return
     * @author André Sulivam
     */
    public String getJsonEmails(String groupClient) {
        String resultado = "";
        List<Long> idClients = convertStringIdClientsToListLong(groupClient);
        List<User> users = userService.findByGroupClient(idClients);
        if (users.size() > 0) {
            for (int i = 0; i < users.size(); i++) {
                if (users.get(i).getEmail() != null && !(users.get(i).getEmail().equals(""))) {
                    if (i != 0 && resultado.length() > 0) {
                        resultado += ",";
                    }
                    resultado += "{\"id\":\"" + users.get(i).getId()
                            + "\",\"name\":\"" + users.get(i).getName()
                            + "\",\"client\":\"" + users.get(i).getClient().getName()
                            + "\",\"status\":\"" + "TO_SEND"
                            + "\",\"email\":\"" + users.get(i).getEmail() + "\"}";
                }
            }
        }
        return resultado;
    }

    /**
     * Método para criar uma lista com os ids dos clientes. <br>
     * A alteração ocorre da seguinte forma: <br>
     * Recebe-se um json com o seguinte formato: [{"id":"1"},{"id":"2"},{"id":"3"}] e retorna uma
     * list de Long com os ids.
     *
     * @param groupClient
     * @return
     * @author André Sulivam
     */
    public List<Long> convertStringIdClientsToListLong(String groupClient) {
        List<Long> idClients = new ArrayList<Long>();
        if (groupClient != null && !groupClient.equals("")) {
            idClients = new ArrayList<Long>();
            groupClient = groupClient.replace("[", ""); // {"id":"1"},{"id":"2"},{"id":"3"}]
            groupClient = groupClient.replace("]", ""); // {"id":"1"},{"id":"2"},{"id":"3"}
            String[] dados = groupClient.split(","); // [0]{"id":"1"}, [1]{"id":"2"}, [2]{"id":"3"}
            String[] valor;
            String id;
            if(dados.length > 0){
                for (String dado : dados) {
                    valor = dado.split(":");// [0]{"id" [1]"1"}
                    id = valor[1]; // "1"}
                    id = id.replace("\"",""); // 1}
                    id = id.replace("}", ""); // 1
                    idClients.add(Long.parseLong(id));
                }
            }
        }
        return idClients;
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
    public String sendEmailSingle(String subject, String message, String emailUser, Long id) {
        String resultado = "{\"id\":\"" + id
                + "\",\"email\":\"" + emailUser;
        try {
            List<String> listEmails = new ArrayList<String>();
            listEmails.add(emailUser);
            emailService.sendEmailByScreenConfiguration(subject, message, listEmails);
            resultado += "\",\"status\":\"SENT"  
                    + "\",\"message\":\"\"}";
        } catch (MessagingException e) {
            resultado += "\",\"status\":\"ERROR"
                    + "\",\"message\":\"" + e.getMessage() + "\"}";
        }
        return resultado;
    }
}