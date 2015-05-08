/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.model;

import java.io.Serializable;
import javax.persistence.*;

/**
 * @author André Sulivam
 */
@Entity
@Table(name = "EMAIL_CONFIG")
public class EmailConfig implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private Long id;

    @Basic
    @Column(name = "SMTP_HOST")
    private String smtpHost;

    @Basic
    @Column(name = "SOCKET_FACTORY_PORT")
    private String socketFactoryPort;

    @Basic
    @Column(name = "AUTH")
    private String auth;

    @Basic
    @Column(name = "SMTP_PORT")
    private String smtpPort;

    @Basic
    @Column(name = "USER_EMAIL")
    private String userEmail;

    @Basic
    @Column(name = "PASSWORD")
    private String password;

    @Basic
    @Column(name = "IMAP")
    private String imap;
    
    // ----------Configurações de email Marketing----------------------------*/
    @Basic
    @Column(name = "MARKETING_SMTP_HOST")
    private String marketingSmtpHost;
     
    @Basic
    @Column(name = "MARKETING_USER_EMAIL")
    private String marketingUserEmail;

    @Basic
    @Column(name = "MARKETING_PASSWORD")
    private String marketingPassword;
    // -----------------------------------------------------------------------*/
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSmtpHost() {
        return smtpHost;
    }

    public void setSmtpHost(String smtpHost) {
        this.smtpHost = smtpHost;
    }

    public String getSocketFactoryPort() {
        return socketFactoryPort;
    }

    public void setSocketFactoryPort(String socketFactoryPort) {
        this.socketFactoryPort = socketFactoryPort;
    }

    public String getSmtpPort() {
        return smtpPort;
    }

    public void setSmtpPort(String smtpPort) {
        this.smtpPort = smtpPort;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getAuth() {
        return auth;
    }

    public void setAuth(String auth) {
        this.auth = auth;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getImap() {
        return imap;
    }

    public void setImap(String imap) {
        this.imap = imap;
    }

    public String getMarketingSmtpHost() {
        return marketingSmtpHost;
    }

    public void setMarketingSmtpHost(String marketingSmtpHost) {
        this.marketingSmtpHost = marketingSmtpHost;
    }

    public String getMarketingUserEmail() {
        return marketingUserEmail;
    }

    public void setMarketingUserEmail(String marketingUserEmail) {
        this.marketingUserEmail = marketingUserEmail;
    }

    public String getMarketingPassword() {
        return marketingPassword;
    }

    public void setMarketingPassword(String marketingPassword) {
        this.marketingPassword = marketingPassword;
    }

}
