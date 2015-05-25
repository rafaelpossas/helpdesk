package com.br.helpdesk.model;

import com.br.helpdesk.util.MimeTypeConstants;

import javax.persistence.*;

/**
 * Created with IntelliJ IDEA.
 * User: rafaelpossas
 Date: 10/18/13
 Time: 1:59 PM
 To change this template use TicketFile | Settings | TicketFile Templates.
 */
@Entity
@Table(name = "ATTACHMENTS")
public class Attachments{
    public Attachments(){

    }
    public Attachments(Long id,String name,Ticket ticket){
        this.id = id;
        this.name = name;
        this.ticket = ticket;
        this.ticketAnswer = null;
        this.byteArquivo = null;
    }
    public Attachments(Long id,String name,TicketAnswer ticketAnswer){
        this.id = id;
        this.name = name;
        this.ticket = null;
        this.ticketAnswer = ticketAnswer;
        this.byteArquivo = null;
    }
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="ID")
    private Long id;
    
    @Basic
    @Column(name= "ARQ_NOME")
    private String name;
        
    @OneToOne
    @JoinColumn(name="TICKET_ID")
    private Ticket ticket;
    
    @OneToOne
    @JoinColumn(name="TICKET_ANSWER_ID")
    private TicketAnswer ticketAnswer;
    
    @Lob
    @Column(name="ARQ_BYTE",nullable=false)
    private byte[] byteArquivo;



    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public byte[] getByteArquivo() {
        return byteArquivo;
    }

    public void setByteArquivo(byte[] byteArquivo) {
        this.byteArquivo = byteArquivo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TicketAnswer getTicketAnswer() {
        return ticketAnswer;
    }

    public void setTicketAnswer(TicketAnswer ticketAnswer) {
        this.ticketAnswer = ticketAnswer;
    }

    
    
}
