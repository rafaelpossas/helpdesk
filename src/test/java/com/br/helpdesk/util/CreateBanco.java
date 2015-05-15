package com.br.helpdesk.util;

import com.br.helpdesk.repository.*;
import com.br.helpdesk.model.*;
import com.br.helpdesk.service.*;
import com.github.springtestdbunit.DbUnitTestExecutionListener;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.annotation.Resource;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;
import org.springframework.test.context.web.WebAppConfiguration;

import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created with IntelliJ IDEA. User: rafaelpossas Date: 10/18/13 Time: 4:32 PM
 * To change this template use File | Settings | File Templates.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(locations = {"file:src/main/webapp/WEB-INF/configuration/application.xml",
    "file:src/main/webapp/WEB-INF/configuration/database_test.xml", "file:src/main/webapp/WEB-INF/configuration/security.xml"})
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class,
    DirtiesContextTestExecutionListener.class,
    TransactionalTestExecutionListener.class,
    DbUnitTestExecutionListener.class})
public class CreateBanco {

    @Autowired
    public CategoryService serviceCategory;

    @Autowired
    public ClientService serviceClient;

    @Autowired
    public PriorityService servicePriority;

    @Autowired
    public TicketService serviceTicket;

    @Autowired
    public UserGroupService serviceUserGroup;

    @Autowired
    public UserService serviceUser;

    @Autowired
    public TicketAnswerService serviceTicketAnswer;

    @Resource
    public CategoryRepository repositoryCategory;

    @Resource
    public ClientRepository repositoryClient;

    @Resource
    public PriorityRepository repositoryPriority;

    @Resource
    public TicketRepository repositoryTicket;

    @Resource
    public UserGroupRepository repositoryUserGroup;

    @Resource
    public UserRepository repositoryUser;

    @Resource
    public TicketAnswerRepository repositoryTicketAnswer;
    
    @Resource
    public PriorityRepository priorityRepository;

    @Before
    public void setup() {
        serviceCategory.setRepository(repositoryCategory);
        serviceClient.setRepository(repositoryClient);
        servicePriority.setRepository(repositoryPriority);
        serviceTicket.setRepository(repositoryTicket);
        serviceUserGroup.setRepository(repositoryUserGroup);
        serviceUser.setRepository(repositoryUser);
        serviceTicketAnswer.setRepository(repositoryTicketAnswer);
    }

    // @Test
    public void createBanco() throws Exception {

        Long i;
        Category category;
        Client client;
        Priority priority;
        Ticket ticket;
        UserGroup userGroup;
        User user;
        //CRIAR ENTIDADES BASICAS
        for (i = 1L; i < 6L; i++) {
            category = new Category();
            category.setName("Category [" + i + "]");
            serviceCategory.save(category);
            client = new Client();
            client.setName("Client [" + i + "]");
            serviceClient.save(client);
            priority = new Priority();
            priority.setName("Priority [" + i + "]");
            servicePriority.save(priority);
            userGroup = new UserGroup();
            userGroup.setName("User Group [" + i + "]");
            serviceUserGroup.save(userGroup);
        }
        //CRIAR USUARIOS
        for (i = 1L; i < 6L; i++) {
            client = serviceClient.findById(i);
            userGroup = serviceUserGroup.findById(i);
            user = new User();
            user.setEmail("email_" + i + "@cymo.com.br");
            user.setName("Name [" + i + "]");
            user.setIsEnabled(Boolean.TRUE);
            user.setPassword("11" + i);
            user.setUserName("11" + i);
            user.setClient(client);
            user.setUserGroup(userGroup);
            serviceUser.save(user);
        }
        //CRIAR TICKETS
        for (i = 1L; i < 6L; i++) {
            user = serviceUser.findById(i);
            client = serviceClient.findById(i);
            category = serviceCategory.findById(i);
            priority = servicePriority.findById(i);
            ticket = new Ticket();
            ticket.setCategory(category);
            ticket.setClient(client);
            ticket.setDescription("Description [" + i + "]");
            ticket.setEndDate(null);
            ticket.setEstimateTime(null);
            ticket.setIsOpen(Boolean.TRUE);
            ticket.setStepsTicket("Passos para reprodução [" + i + "]");
            ticket.setPriority(priority);
            ticket.setResponsible(null);
            ticket.setStartDate(new Date());
            ticket.setUser(user);
            ticket.setTitle("Title [" + i + "]");

            serviceTicket.save(ticket);
        }
    }

    //@Test
    public void updateDatabaseWithLastInteration() {
        List<Ticket> allTickets = serviceTicket.findAll();
        if (allTickets != null && allTickets.size() > 0) {
            TicketAnswer answer = null;
            for (Ticket ticket : allTickets) {
                answer = serviceTicketAnswer.findLastAnswersByTicket(ticket);
                if (answer != null) {
                    ticket.setLastInteration(answer.getDateCreation());
                    ticket.setUserLastInteration(answer.getUser());
                } else {
                    ticket.setLastInteration(ticket.getStartDate());
                    ticket.setUserLastInteration(ticket.getUser());
                }
                serviceTicket.save(ticket);
                answer = null;
            }
        }
    }

    //@Test
    public void updateDatabasePriority() {
        List<Ticket> allTickets = serviceTicket.findAll();
        if (allTickets != null && allTickets.size() > 0) {
            List<Priority> priorities = (List)servicePriority.findAll();
            for (Ticket ticket : allTickets) {
                if(isUrgent(ticket)){
                    ticket.setPriority(priorities.get(4));
                } else if(isHigh(ticket)){
                    ticket.setPriority(priorities.get(3));
                } else if(isMedia(ticket)){
                    ticket.setPriority(priorities.get(2));
                } else if(isLow(ticket)){
                    ticket.setPriority(priorities.get(1));
                } else {
                    ticket.setPriority(priorities.get(0));
                }
                serviceTicket.save(ticket);
            }
        }
    }

    public boolean isUrgent(Ticket ticket) {
        String idsTemp = "6 18 36 128 216 249 895";
        String[] ids = idsTemp.split(" ");
        long temp = 0L;
        for (String idTemp : ids) {
            temp = Long.parseLong(idTemp);
            if (ticket.getId().equals(temp)) {
                return true;
            }
        }
        return false;
    }

    public boolean isHigh(Ticket ticket) {
        String idsTemp = "88 95 147 171 172 340 711 722 726 730 739 749";
        String[] ids = idsTemp.split(" ");
        long temp = 0L;
        for (String idTemp : ids) {
            temp = Long.parseLong(idTemp);
            if (ticket.getId().equals(temp)) {
                return true;
            }
        }
        return false;
    }

    public boolean isMedia(Ticket ticket) {
        String idsTemp = "2 4 8 15 17 19 20 24 29 38 39 40 41 47 54 55 58 69 92 94 99 100 116 163 244 254 283 285 1156";
        String[] ids = idsTemp.split(" ");
        long temp = 0L;
        for (String idTemp : ids) {
            temp = Long.parseLong(idTemp);
            if (ticket.getId().equals(temp)) {
                return true;
            }
        }
        return false;
    }

    public boolean isLow(Ticket ticket) {
        String idsTemp = "3 5 9 10 11 12 13 21 22 23 26 27 35 37 42 44 45 50 56 79 90 107 119 121 122 123 134 143 178 303";
        String[] ids = idsTemp.split(" ");
        long temp = 0L;
        for (String idTemp : ids) {
            temp = Long.parseLong(idTemp);
            if (ticket.getId().equals(temp)) {
                return true;
            }
        }
        return false;
    }
}
