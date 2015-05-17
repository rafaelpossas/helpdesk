package com.br.helpdesk.model;

import org.hibernate.annotations.*;
import org.hibernate.annotations.CascadeType;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;
import java.util.List;
import java.util.Set;

/**
 * Created with IntelliJ IDEA. User: rafaelpossas Date: 13/10/13 Time: 09:04 To
 * change this template use File | Settings | File Templates.
 */
@Entity
@Table(name = "TICKET")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private Long id;

    @Basic
    @Column(name = "ISOPEN", nullable = false)
    private Boolean isOpen;

    @OneToOne
    @JoinColumn(name = "USER_ID", nullable = true)
    private User user;

    @Basic
    @Column(name = "START_DATE", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date startDate;

    @Basic
    @Column(name = "END_DATE", nullable = true)
    @Temporal(TemporalType.TIMESTAMP)
    private Date endDate;

    @Lob
    @Column(name = "DESCRIPTION")
    private String description;

    @Basic
    @Column(name = "TITLE")
    private String title;

    @Lob
    @Column(name = "STEPS_TICKET")
    private String stepsTicket;

    @OneToOne
    @JoinColumn(name = "RESPONSIBLE_ID", nullable = true)
    private User responsible;

    @OneToOne
    @JoinColumn(name = "CATEGORY_ID", nullable = false)
    private Category category;

    @OneToOne
    @JoinColumn(name = "CLIENT_ID", nullable = false)
    private Client client;

    @OneToOne
    @JoinColumn(name = "PRIORITY_ID", nullable = true)
    private Priority priority;

    @Basic
    @Column(name = "ESTIMATE_TIME", nullable = true)
    @Temporal(TemporalType.DATE)
    private Date estimateTime;

    @Basic
    @Column(name = "LAST_INTERATION", nullable = true)
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastInteration;
    
    @OneToOne
    @JoinColumn(name = "USER_LAST_INTERATION_ID", nullable = true)
    private User userLastInteration;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "ticket")
    @Cascade(value = CascadeType.REMOVE)
    private Set<ChangesTicket> changes;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "ticket")
    @Cascade(value = CascadeType.REMOVE)
    private Set<TicketAnswer> answers;

    @Transient
    private String userName;
    @Transient
    private String clientName;
    @Transient
    private String userGroupName;
    @Transient
    private String responsibleName;
    @Transient
    private String categoryName;
    @Transient
    private String priorityName;

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public Boolean isIsOpen() {
        return isOpen;
    }

    public User getUser() {
        return user;
    }

    public Date getStartDate() {
        return startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public String getDescription() {
        return description;
    }

    public String getTitle() {
        return title;
    }

    public String getStepsTicket() {
        return stepsTicket;
    }

    public void setStepsTicket(String stepsTicket) {
        this.stepsTicket = stepsTicket;
    }

    public User getResponsible() {
        return responsible;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setIsOpen(Boolean isOpen) {
        this.isOpen = isOpen;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setResponsible(User responsible) {
        this.responsible = responsible;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public Date getEstimateTime() {
        return estimateTime;
    }

    public void setEstimateTime(Date estimateTime) {
        this.estimateTime = estimateTime;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getUserGroupName() {
        return userGroupName;
    }

    public void setUserGroupName(String userGroupName) {
        this.userGroupName = userGroupName;
    }

    public String getResponsibleName() {
        return responsibleName;
    }

    public void setResponsibleName(String responsibleName) {
        this.responsibleName = responsibleName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getPriorityName() {
        return priorityName;
    }

    public void setPriorityName(String priorityName) {
        this.priorityName = priorityName;
    }

    public Date getLastInteration() {
        return lastInteration;
    }

    public void setLastInteration(Date lastInteration) {
        this.lastInteration = lastInteration;
    }

    public User getUserLastInteration() {
        return userLastInteration;
    }

    public void setUserLastInteration(User userLastInteration) {
        this.userLastInteration = userLastInteration;
    }

}
