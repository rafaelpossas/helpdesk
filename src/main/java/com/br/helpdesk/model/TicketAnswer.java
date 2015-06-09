/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.br.helpdesk.model;

import java.util.Calendar;
import java.util.Date;
import javax.persistence.*;

/**
 *
 * @author ricardo
 */

@Entity
@Table(name = "TICKET_ANSWER")
public class TicketAnswer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name="TICKET_ID",nullable = false)
    private Ticket ticket;  
    
    @Lob
    @Basic
    @Column(name = "DESCRIPTION")
    private String description;

    @OneToOne
    @JoinColumn(name="USER_ID",nullable = false)
    private User user;
    
    @Basic
    @Column(name="DATE_CREATION",nullable = true)
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreation;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }  
    
    public Long getId() {
        return id;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public String getDescription() {
        return description;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(Date dateCreation) {
        this.dateCreation = dateCreation;
    }   

}
