/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.service;

import com.Consts;
import com.br.helpdesk.model.User;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Resource;
import javax.mail.MessagingException;
import org.json.JSONArray;
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
        List<User> users = new ArrayList<User>();
        if (idClients != null && idClients.size() > 0) {
            List<User> usersTemp = new ArrayList<User>();
            for (Long idClient : idClients) {
                if (!idClient.equals(0L)) {
                    usersTemp = userService.findByClientAndIsEnabled(idClient, Boolean.TRUE);
                    users.addAll(usersTemp);
                } else if (idClient.equals(0L)) {
                    usersTemp = userService.findByUserGroupAndIsEnabled(1L, Boolean.TRUE);
                    users.addAll(usersTemp);
                }
            }
        }
        if (users.size() > 0) {
            users = removeDuplicateUsers(users);
            for (int i = 0; i < users.size(); i++) {
                if (users.get(i).getEmail() != null && !(users.get(i).getEmail().equals(""))) {
                    if (i != 0 && resultado.length() > 0) {
                        resultado += ",";
                    }
                    resultado += "{\"id\":\"" + users.get(i).getId()
                            + "\",\"name\":\"" + users.get(i).getName()
                            + "\",\"client\":\"" + users.get(i).getClient().getName()
                            + "\",\"status\":\"" + Consts.TO_SEND
                            + "\",\"email\":\"" + users.get(i).getEmail() + "\"}";
                }
            }
        }

        return resultado;
    }

    /**
     * Remove usuários duplicados na lista.
     *
     * @author André Sulivam
     * @param list
     * @return
     */
    public List<User> removeDuplicateUsers(List<User> list) {
        boolean userFound = false;
        List<User> listWithoutDuplicate = new ArrayList<User>();
        for (User user : list) {
            for (User userTemp : listWithoutDuplicate) {
                if (user.getId().equals(userTemp.getId())) {
                    userFound = true;
                }
            }
            if (!userFound) {
                listWithoutDuplicate.add(user);
            }
            userFound = false;
        }
        return listWithoutDuplicate;
    }

    /**
     * Método para criar uma lista com os ids dos clientes. <br>
     * A alteração ocorre da seguinte forma: <br>
     * Recebe-se um json com o seguinte formato:
     * [{"id":"1"},{"id":"2"},{"id":"3"}] e retorna uma list de Long com os ids.
     *
     * @param groupClient
     * @return
     * @author André Sulivam
     */
    public List<Long> convertStringIdClientsToListLong(String groupClient) {
        List<Long> idClients = new ArrayList<Long>();
        if (groupClient != null && !groupClient.equals("")) {
            JSONArray clientsJson = new JSONArray(groupClient);
            String id = "";
            for (int i = 0; i < clientsJson.length(); i++) {
                id = clientsJson.getJSONObject(i).get(Consts.ID).toString();
                idClients.add(Long.parseLong(id));
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
     * @throws Exception
     */
    public String sendEmailSingle(String subject, String message, String emailUser, Long id) throws Exception {
        String resultado = "{\"id\":\"" + id
                + "\",\"email\":\"" + emailUser;
        try {
            List<String> listEmails = new ArrayList<String>();
            listEmails.add(emailUser);
            emailService.sendEmailByScreenConfiguration(subject, message, listEmails);
            resultado += "\",\"status\":\"SENT"
                    + "\",\"message\":\"\"}";
        } catch (MessagingException e) {
            String error = e.getMessage();
            error = error.replace("\n", "");
            resultado += "\",\"status\":\"ERROR"
                    + "\",\"message\":\"" + error + "\"}";
        }
        return resultado;
    }
}
