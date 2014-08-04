/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.br.helpdesk.model;

import java.util.Date;

/**
 *
 * @author Sulivam
 */
public class ConsolidatedPerMonthContainer {
    
    private String date;
    private String name;
    private int openFrom;
    private int openTo;
    private int created;
    private int closed;
    private int value;
    private Date dateOpenFrom;
    private Date dateOpenTo;

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getOpenFrom() {
        return openFrom;
    }

    public void setOpenFrom(int openFrom) {
        this.openFrom = openFrom;
    }

    public int getOpenTo() {
        return openTo;
    }

    public void setOpenTo(int openTo) {
        this.openTo = openTo;
    }

    public int getCreated() {
        return created;
    }

    public void setCreated(int created) {
        this.created = created;
    }

    public int getClosed() {
        return closed;
    }

    public void setClosed(int closed) {
        this.closed = closed;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public Date getDateOpenFrom() {
        return dateOpenFrom;
    }

    public void setDateOpenFrom(Date dateOpenFrom) {
        this.dateOpenFrom = dateOpenFrom;
    }

    public Date getDateOpenTo() {
        return dateOpenTo;
    }

    public void setDateOpenTo(Date dateOpenTo) {
        this.dateOpenTo = dateOpenTo;
    }
    
    
    
}
