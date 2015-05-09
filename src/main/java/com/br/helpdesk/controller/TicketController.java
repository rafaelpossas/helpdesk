package com.br.helpdesk.controller;

import com.Consts;
import com.br.helpdesk.model.Attachments;
import com.br.helpdesk.model.Category;
import com.br.helpdesk.model.DashboardValue;
import com.br.helpdesk.model.Priority;
import com.br.helpdesk.model.Ticket;
import com.br.helpdesk.model.User;
import com.br.helpdesk.service.EmailService;
import com.br.helpdesk.service.AttachmentsService;
import com.br.helpdesk.service.CategoryService;
import com.br.helpdesk.service.PriorityService;
import com.br.helpdesk.service.TicketAnswerService;
import com.br.helpdesk.service.TicketService;
import com.br.helpdesk.service.UserService;
import java.io.File;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import javax.persistence.EntityNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@Controller
@RequestMapping("/ticket")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    public void setService(TicketService service) {
        this.ticketService = service;
    }

    @Autowired
    public TicketController(TicketService service) {
        this.ticketService = service;
    }

    @Autowired
    private UserService userService;

    public void setUserService(UserService service) {
        this.userService = service;
    }

    @Autowired
    private AttachmentsService attachmentsService;

    public void setFileService(AttachmentsService service) {
        this.attachmentsService = service;
    }

    @Autowired
    private EmailService emailService;

    public void setEmailService(EmailService service) {
        this.emailService = service;
    }

    @Autowired
    private TicketAnswerService ticketAnswerService;

    public void setTicketAnswerService(TicketAnswerService service) {
        this.ticketAnswerService = service;
    }

    @Autowired
    private PriorityService priorityService;

    public void setPriorityService(PriorityService service) {
        this.priorityService = service;
    }

    @Autowired
    private CategoryService categoryService;

    public void setCategoryService(CategoryService service) {
        this.categoryService = service;
    }

    @Autowired
    private ChangesTicketController changesTicketController;

    public void setChangesTicketController(ChangesTicketController controller) {
        this.changesTicketController = controller;
    }

    /**
     * FindAll sem registro de qual usuário fez a requisição.
     * @return 
     */
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List<Ticket> getAllTickets() {
        return ticketService.findAll();
    }

    /**
     * FindAll com registro do usuário que fez a requisição.
     * @param username
     * @return 
     */
    @RequestMapping(value = "/all", method = RequestMethod.GET, params = {"user"})
    public @ResponseBody
    List<Ticket> getAllTicketsByUser(@RequestParam(value = "user") String username) {
        User user = this.userService.findByUserName(username);
        if (user.getUserGroup().getId() == Consts.ADMIN_GROUP_ID) {//SUPERUSER
            return ticketService.findAll(user);
        } else {
            return ticketService.findByUser(user);
        }
    }

    @RequestMapping(value = "/all-paging", method = RequestMethod.GET, params = {"user", "start", "limit"})
    public @ResponseBody
    List<Ticket> getAllTicketsByUserPaging(@RequestParam(value = "user") String username, @RequestParam(value = "start") int start, @RequestParam(value = "limit") int limit) {
        User user = this.userService.findByUserName(username);
        PageRequest pageRequest = getPageRequest(limit, start);

        if (user.getUserGroup().getId() == Consts.ADMIN_GROUP_ID) {//SUPERUSER
            return ticketService.findAll(pageRequest);
        } else {
            return ticketService.findByUserWithPaging(user, pageRequest);
        }
    }

    @RequestMapping(value = "/opened", method = RequestMethod.GET, params = {"user"})
    public @ResponseBody
    List<Ticket> getTicketsOpenedByUser(@RequestParam(value = "user") String username) {
        User user = this.userService.findByUserName(username);

        if (user.getUserGroup().getId() == Consts.ADMIN_GROUP_ID) {//SUPERUSER
            return ticketService.findByIsOpenAndResponsibleNotNull(true);
        } else {
            return ticketService.findByIsOpenAndUser(true, user);
        }
    }

    @RequestMapping(value = "/opened-paging", method = RequestMethod.GET, params = {"user", "start", "limit"})
    public @ResponseBody
    List<Ticket> getTicketsOpenedByUserWithPaging(@RequestParam(value = "user") String username, @RequestParam(value = "start") int start, @RequestParam(value = "limit") int limit) {
        User user = this.userService.findByUserName(username);
        PageRequest pageRequest = getPageRequest(limit, start);

        if (user.getUserGroup().getId() == Consts.ADMIN_GROUP_ID) {//SUPERUSER
            return ticketService.findByIsOpenAndResponsibleNotNullWithPaging(true, pageRequest, user);
        } else {
            return ticketService.findByIsOpenAndUser(true, user);
        }
    }

    @RequestMapping(value = "/closed", method = RequestMethod.GET, params = {"user"})
    public @ResponseBody
    List<Ticket> getTicketsClosedByUser(@RequestParam(value = "user") String username) {
        User user = this.userService.findByUserName(username);
        if (user.getUserGroup().getId() == Consts.ADMIN_GROUP_ID) {//SUPERUSER
            return ticketService.findByIsOpen(false);
        } else {
            return ticketService.findByIsOpenAndUser(false, user);
        }
    }

    @RequestMapping(value = "/closed-paging", method = RequestMethod.GET, params = {"user", "start", "limit"})
    public @ResponseBody
    List<Ticket> getTicketsClosedByUserWithPaging(@RequestParam(value = "user") String username, @RequestParam(value = "start") int start, @RequestParam(value = "limit") int limit) {
        User user = this.userService.findByUserName(username);
        PageRequest pageRequest = getPageRequest(limit, start);

        if (user.getUserGroup().getId() == Consts.ADMIN_GROUP_ID) {//SUPERUSER
            return ticketService.findByIsOpenWithPaging(false, pageRequest, user);
        } else {
            return ticketService.findByIsOpenAndUserWithPaging(false, user, pageRequest);
        }
    }

    @RequestMapping(value = "/mytickets", method = RequestMethod.GET, params = {"user"})
    public @ResponseBody
    List<Ticket> getMyTickets(@RequestParam(value = "user") String username) {
        User user = this.userService.findByUserName(username);
        return ticketService.findByResponsible(user);
    }

    @RequestMapping(value = "/mytickets-paging", method = RequestMethod.GET, params = {"user", "start", "limit"})
    public @ResponseBody
    List<Ticket> getMyTicketsWithPaging(@RequestParam(value = "user") String username, @RequestParam(value = "start") int start, @RequestParam(value = "limit") int limit) {
        User user = this.userService.findByUserName(username);
        PageRequest pageRequest = getPageRequest(limit, start);
        return ticketService.findByResponsibleWithPaging(user, pageRequest);
    }

    @RequestMapping(value = "/withoutresponsible", method = RequestMethod.GET, params = {"user"})
    public @ResponseBody
    List<Ticket> getTicketsWithoutResponsible(@RequestParam(value = "user") String username) {
        return ticketService.findByResponsible(null);
    }

    @RequestMapping(value = "/withoutresponsible-paging", method = RequestMethod.GET, params = {"user", "start", "limit"})
    public @ResponseBody
    List<Ticket> getTicketsWithoutResponsibleWithPaging(@RequestParam(value = "user") String username, @RequestParam(value = "start") int start, @RequestParam(value = "limit") int limit) {
        PageRequest pageRequest = getPageRequest(limit, start);
        return ticketService.findByResponsibleWithPaging(null, pageRequest);
    }

    @RequestMapping(value = "/textmenu", method = RequestMethod.GET, params = {"user"}, produces = "application/json;charset=UTF-8")
    public @ResponseBody
    String getTextMenu(@RequestParam(value = "user") String username, HttpServletResponse response) throws UnsupportedEncodingException {
        User user = this.userService.findByUserName(username);
        Long todos, abertos, fechados, withoutresponsible, mytickets;
        if (user.getUserGroup().getId() == Consts.ADMIN_GROUP_ID) {//SUPERUSER
            todos = ticketService.countFindAll();
            abertos = ticketService.countByIsOpenAndResponsibleNotNull(true);
            fechados = ticketService.countByIsOpen(false);
            mytickets = ticketService.countByResponsible(user);
            withoutresponsible = ticketService.countByResponsible(null);
        } else {
            todos = ticketService.countByUser(user);
            abertos = ticketService.countByIsOpenAndUser(true, user);
            fechados = ticketService.countByIsOpenAndUser(false, user);
            mytickets = 0L;
            withoutresponsible = 0L;
        }
        return "{\"todos\":'" + todos + "', \"abertos\": '" + abertos + "', \"fechados\": '" + fechados + "', \"mytickets\": '" + mytickets + "', \"withoutresponsible\": '" + withoutresponsible + "'}";
    }

    @RequestMapping(value = {"close-ticket/{id}"}, method = {RequestMethod.PUT})
    @ResponseBody
    public Ticket closeTicket(@RequestBody Ticket ticket, @RequestParam(value = "user") String username) {
        User user = userService.findByUserName(username);
        Ticket olderTicket = ticketService.findById(ticket.getId());
        ticket.setIsOpen(false);
        ticket.setEndDate(Calendar.getInstance().getTime());
        ticket = ticketService.save(ticket);
        Long ticketId = ticket.getId();
        String ticketTitle = ticket.getTitle();
        if (olderTicket != null) {
            changesTicketController.save(olderTicket, ticket, user);
        }
        List<String> emails = emailService.getListEmailsToSend(olderTicket, ticket, null);
        if (emails.size() > 0) {
            String subjectString = "Encerramento do Ticket #" + ticketId + "#: " + ticketTitle;
            String contentString = emailService.contentCloseTicket(ticketId, ticketTitle);
            emailService.sendEmail(emails,subjectString,contentString, Consts.DEFAULT);
        }
        return ticket;
    }

    @RequestMapping(value = {"open-ticket/{id}"}, method = {RequestMethod.PUT})
    @ResponseBody
    public Ticket openTicket(@RequestBody Ticket ticket, @RequestParam(value = "user") String username) {        
        User user = userService.findByUserName(username);

        Ticket olderTicket = ticketService.findById(ticket.getId());
        ticket.setIsOpen(true);
        ticket.setEndDate(null);
        ticket = ticketService.save(ticket);
        Long ticketId = ticket.getId();
        String ticketTitle = ticket.getTitle();
        
        if (olderTicket != null) {
            changesTicketController.save(olderTicket, ticket, user);
        }
        List<String> emails = emailService.getListEmailsToSend(olderTicket, ticket, null);
        if (emails.size() > 0) {
                
            String subjectString = "Reabertura do Ticket #" + ticketId + "#: " + ticketTitle;
            String contentString = emailService.contentOpenTicket(ticketId, ticketTitle);
            emailService.sendEmail(emails,subjectString,contentString, Consts.DEFAULT);
        }
        return ticket;
    }

    @RequestMapping(value = {"", "/{id}"}, method = {RequestMethod.POST, RequestMethod.PUT}, params = {"user"})
    @ResponseBody
    public Ticket save(@RequestBody Ticket newTicket, @RequestParam(value = "user") String username) throws IOException {
        User user = userService.findByUserName(username);
        List<File> filesToSave = attachmentsService.getAttachmentsFromUser(username);

        List<String> emails = new ArrayList<String>();
        Ticket olderTicket = null;

        // verificando se é edição ou novo ticket.
        if (newTicket.getId() != null) {
            // buscando o ticket já existente no banco.
            olderTicket = ticketService.findById(newTicket.getId());
        } else {
            // como novo ticket, é necessário instanciar a data de início do ticket.
            newTicket.setStartDate(new Date());
        }

        if (newTicket.getPriority() == null) {
            //buscando a prioridade do banco de dados: 'Sem prioridade'
            Priority priority = priorityService.findById(1L);
            newTicket.setPriority(priority);
        }
        
        //buscando novamente a categoria no banco porque o valor do 'name' está vindo do extjs com o valor de translations
        Category category = categoryService.findById(newTicket.getCategory().getId());       
        newTicket.setCategory(category);
        
        if (olderTicket == null) {
            // se é novo ticket.
            newTicket.setLastInteration(newTicket.getStartDate());
            newTicket.setUserLastInteration(newTicket.getUser());
        }
        
        newTicket = ticketService.save(newTicket);

        if (olderTicket != null) {     
            // se é edição de um ticket, salvar qual foi a mudança.
            changesTicketController.save(olderTicket, newTicket, user);
        }

        // salvando anexos do ticket.
        Attachments attachment = null;
        for (File file : filesToSave) {
            attachment = new Attachments();
            attachment.setName(file.getName());
            attachment.setByteArquivo(attachmentsService.getBytesFromFile(file));
            attachment.setTicket(newTicket);
            attachmentsService.save(attachment);
            file.delete();
        }

        // buscando para quais emails que receberão a notificação.
        emails = emailService.getListEmailsToSend(olderTicket, newTicket, null);
        String subjectString;
        String contentString;
        if (emails.size() > 0) {
            if (olderTicket != null) {
                subjectString = "Atualização do Ticket #" + olderTicket.getId() + "#: " + olderTicket.getTitle();
                contentString = emailService.contentEditTicket(olderTicket, newTicket);
               
            } else {
                subjectString = "Novo Ticket #" + newTicket.getId() + "#: " + newTicket.getTitle();
                contentString = emailService.contentNewTicket(newTicket);
            }
            emailService.sendEmail(emails,subjectString,contentString,Consts.DEFAULT); //NEW
        }
        return newTicket;
    }

    @RequestMapping(value = {"/save_without_email_routine", "/save_without_email_routine/{id}"}, method = {RequestMethod.POST, RequestMethod.PUT}, params = {"user"})
    @ResponseBody
    public Ticket saveWithoutEmailRoutine(@RequestBody Ticket ticket, @RequestParam(value = "user") String username) throws IOException {
        User user = userService.findByUserName(username);
        List<File> filesToSave = attachmentsService.getAttachmentsFromUser(username);

        List<String> emails = new ArrayList<String>();
        Ticket olderTicket = null;

        if (!(ticket.getId() == null)) {
            olderTicket = ticketService.findById(ticket.getId());
        } else {
            ticket.setStartDate(new Date());
        }

        if (ticket.getPriority() == null) {
            //buscando 'sem prioridade'
            Priority priority = priorityService.findById(1L);
            ticket.setPriority(priority);
        }
        //buscando novamente a categoria no banco porque o valor do 'name' está vindo do extjs com o valor de translations
        Category category = categoryService.findById(ticket.getCategory().getId());
        ticket.setCategory(category);
        if (olderTicket == null) {            
            ticket.setLastInteration(ticket.getStartDate());
            ticket.setUserLastInteration(ticket.getUser());
        }
        ticket = ticketService.save(ticket);

        if (olderTicket != null) {            
            changesTicketController.save(olderTicket, ticket, user);
        }

        Attachments attachment = null;
        for (File file : filesToSave) {
            attachment = new Attachments();
            attachment.setName(file.getName());
            attachment.setByteArquivo(attachmentsService.getBytesFromFile(file));
            attachment.setTicket(ticket);
            attachmentsService.save(attachment);
            file.delete();
        }
        return ticket;
    }

    
    public PageRequest getPageRequest(int limit, int start) {
        int pageSize = limit - start;
        int page;
        if (start == 0) {
            page = 0;
        } else {
            page = (limit / pageSize) - 1;
        }
        return new PageRequest(page, pageSize);
    }
    
    @RequestMapping(value = "/search", method = RequestMethod.GET, params = {"user","searchterm","typesearch","start", "limit"})
    public @ResponseBody Page<Ticket> getTicketsBySearch( @RequestParam(value = "user") String username,
            @RequestParam(value = "searchterm") String searchTerm,
            @RequestParam(value = "typesearch") String typeSearch,
            @RequestParam(value = "start") int start, 
            @RequestParam(value = "limit") int limit) throws UnsupportedEncodingException {
        PageRequest pageRequest = getPageRequest(limit, start);
        searchTerm = new String(searchTerm.getBytes(), "UTF-8"); 
        User user = this.userService.findByUserName(username);
        return ticketService.searchTickets(user,searchTerm,typeSearch,pageRequest);
    }
    
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Entidade não encontrada")
    public void handleEntityNotFoundException(Exception ex) {
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public void handleDataIntegrityViolationException(DataIntegrityViolationException ex, HttpServletResponse response) throws IOException {
        response.sendError(HttpServletResponse.SC_FORBIDDEN, ex.getMessage());
    }
    
    /**
     * 
     * Recebe os valores que geram os gráficos e informações na tela de dashboard     
     */
    @RequestMapping(value = "/dashboard-values", method = RequestMethod.GET)
    public @ResponseBody List<DashboardValue> getValuesDashboard() {
        
        List<DashboardValue> valores = new ArrayList<DashboardValue>(); 
        
        List<User>users = userService.findAll();
        Iterable<Category> categories = categoryService.findAll();
        List<Ticket>tickets = ticketService.findAll();       
        DashboardValue valor;
        int count;
        
        //Recebe os valores de Tickets x Categoria
        if(categories!=null){            
            for(Category category:categories){
                count = 0;
                for(Ticket ticket:tickets){
                    if(ticket.getCategory().getId() == category.getId()){
                        count++;                        
                    }
                }
                valor = new DashboardValue();
                valor.setType("categoria-ticket");
                valor.setCount(count);
                valor.setDescription(category.getName());
                valores.add(valor);                
            }            
        }
        
        //Recebe os valores dos status dos tickets (Abertos,fechados,sem responsável)
        int countOpen = 0,countClosed = 0,countNoResp = 0,countOnGoing = 0,countOnGoingNoResp = 0;
        for(Ticket ticket:tickets){
            if(ticket.isIsOpen()){
                countOpen++;
            }else{
                countClosed++;
            }
            if(ticket.getResponsible()==null){
                countNoResp++;
            }
            if(ticket.getResponsible()==null && ticket.isIsOpen()== true){
                countOnGoingNoResp++;
            }  
        }    
        valor = new DashboardValue();
        valor.setType("status-ticket");
        valor.setDescription("Abertos");
        valor.setCount(countOpen);
        valores.add(valor);
        
        valor = new DashboardValue();
        valor.setType("open-ticket");
        valor.setDescription("Abertos");
        valor.setCount(countOpen);
        valores.add(valor);
        
        valor = new DashboardValue();
        valor.setType("status-ticket");
        valor.setDescription("Fechados");
        valor.setCount(countClosed);
        valores.add(valor);
        
        valor = new DashboardValue();
        valor.setType("status-ticket");
        valor.setDescription("Sem Responsável");
        valor.setCount(countNoResp);
        valores.add(valor);
        
        valor = new DashboardValue();
        valor.setType("no-responsible-open");
        valor.setDescription("Sem Responsável");
        valor.setCount(countOnGoingNoResp);
        valores.add(valor);
        
        //Recebe os valores de Tickets x Usuarios
        
        for (User user : users){
            count = 0;
            int countAgent = 0;
            int countOpenTickets = 0;
            for(Ticket ticket:tickets){
                if(ticket.getUser()!=null && ticket.getUser().getId() == user.getId()){
                    count++;
                }
                if(ticket.getUser()!=null && ticket.isIsOpen() && ticket.getUser().getId() == user.getId()){
                    countOpenTickets++;
                }
                if(ticket.getResponsible()!=null && ticket.isIsOpen() && ticket.getResponsible().getId() == user.getId()){
                    countAgent++;
                }
            }  
            if(count>0){
                valor = new DashboardValue();
                valor.setType("user-ticket");
                valor.setDescription(user.getName());
                valor.setCount(count);
                valores.add(valor);
            }
            if(countOpenTickets>0){
                valor = new DashboardValue();
                valor.setType("user-ticket-open");
                valor.setDescription(user.getName());
                valor.setCount(countOpenTickets);
                valores.add(valor);
            }
            //Recebe os valores de Tickets x Agentes
            if(countAgent>0){
                valor = new DashboardValue();
                valor.setType("agent-ticket");
                valor.setDescription(user.getName());
                valor.setCount(countAgent);
                valores.add(valor);
            }
        }
        
        return valores;
    }   
}
