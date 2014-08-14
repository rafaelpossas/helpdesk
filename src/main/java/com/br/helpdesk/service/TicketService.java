package com.br.helpdesk.service;

import com.br.helpdesk.model.Ticket;
import com.br.helpdesk.model.User;
import com.br.helpdesk.repository.TicketRepository;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import javax.annotation.Resource;
import org.apache.commons.collections.IteratorUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class TicketService {

    @Resource
    private TicketRepository repository;

    public void setRepository(TicketRepository repository) {
        this.repository = repository;
    }

    @Autowired
    private TicketAnswerService ticketAnswerService;

    public void setTicketAnswerService(TicketAnswerService service) {
        this.ticketAnswerService = service;
    }

    @Autowired
    private UserService userService;

    public void setUserService(UserService service) {
        this.userService = service;
    }

    public Ticket save(Ticket model) {
        return repository.save(model);
    }

    /**
     * FindAll ordenando por ID.
     *
     * @return
     */
    public List<Ticket> findAll() {
        return IteratorUtils.toList(repository.findAll().iterator());
    }

    /**
     * FindAll ordenando por última interação.
     *
     * @param user
     * @return
     */
    public List<Ticket> findAll(User user) {
        List<Ticket> resultFinal = IteratorUtils.toList(repository.findAll().iterator());
        resultFinal = orderByLastInteration(resultFinal);
        return resultFinal;
    }

    /**
     * ********************************** COUNT ******************************************
     */
    public Long countFindAll() {
        return repository.countByFindAll();
    }

    public Long countByIsOpenAndResponsibleNotNull(Boolean isOpen) {
        return repository.countByIsOpenAndResponsibleNotNull(isOpen);
    }

    public Long countByIsOpen(Boolean isOpen) {
        return repository.countByIsOpen(isOpen);
    }

    public Long countByResponsible(User user) {
        return repository.countByResponsibleAndIsOpen(user, true);
    }

    public Long countByUser(User user) {
        return repository.countByUser(user);
    }

    public Long countByIsOpenAndUser(Boolean isOpen, User user) {
        return repository.countByIsOpenAndUser(isOpen, user);
    }

    /**
     * ************************************************************************************
     */
    public void delete(Ticket model) {
        repository.delete(model);
    }

    public List<Ticket> findByUser(User user) {
        List<Ticket> resultFinal = IteratorUtils.toList(repository.findByUser(user).iterator());
        resultFinal = orderByWaitingAndLastInteration(resultFinal, user);
        return resultFinal;
    }

    public List<Ticket> findByUserWithPaging(User user, Pageable pageable) {
        List<Ticket> resultFinal = IteratorUtils.toList(repository.findByUserOrderByIdDesc(user, pageable).iterator());
        resultFinal = orderByWaitingAndLastInteration(resultFinal, user);
        return resultFinal;
    }

    public List<Ticket> findByIsOpen(Boolean isOpen) {
        return IteratorUtils.toList(repository.findByIsOpen(isOpen).iterator());
    }

    public List<Ticket> findByIsOpenWithPaging(Boolean isOpen, Pageable pageable, User user) {
        List<Ticket> resultFinal = IteratorUtils.toList(repository.findByIsOpenOrderByIdDesc(isOpen, pageable).iterator());
        resultFinal = orderByWaitingAndLastInteration(resultFinal, user);
        return resultFinal;
    }

    public List<Ticket> findByIsOpenAndResponsibleNotNullWithPaging(Boolean isOpen, Pageable pageable, User user) {
        List<Ticket> resultFinal = IteratorUtils.toList(repository.findByIsOpenAndResponsibleNotNullOrderByIdDesc(isOpen, pageable).iterator());
        resultFinal = orderByWaitingAndLastInteration(resultFinal, user);
        return resultFinal;
    }

    public List<Ticket> findByIsOpenAndUser(Boolean isOpen, User user) {
        List<Ticket> resultFinal = IteratorUtils.toList(repository.findByIsOpenAndUser(isOpen, user).iterator());
        resultFinal = orderByWaitingAndLastInteration(resultFinal, user);
        return resultFinal;
    }

    public List<Ticket> findByIsOpenAndUserWithPaging(Boolean isOpen, User user, Pageable pageable) {
        List<Ticket> resultFinal = IteratorUtils.toList(repository.findByIsOpenAndUserOrderByIdDesc(isOpen, user, pageable).iterator());
        resultFinal = orderByWaitingAndLastInteration(resultFinal, user);
        return resultFinal;
    }

    public List<Ticket> findByResponsible(User user) {
        List<Ticket> resultFinal = IteratorUtils.toList(repository.findByResponsibleAndIsOpen(user, true).iterator());
        resultFinal = orderByWaitingAndLastInteration(resultFinal, user);
        return resultFinal;
    }

    public Ticket findById(Long codigo) {
        return repository.findOne(codigo);
    }

    public List<Ticket> findByResponsibleWithPaging(User user, Pageable pageable) {
        List<Ticket> resultFinal = IteratorUtils.toList(repository.findByResponsibleAndIsOpenOrderByIdDesc(user, true, pageable).iterator());
        resultFinal = orderByWaitingAndLastInteration(resultFinal, user);
        return resultFinal;
    }

    public List<Ticket> findAll(Pageable pageable) {
        Page<Ticket> tickets = repository.findAll(pageable);
        List<Ticket> resultFinal = orderByLastInteration(new ArrayList<Ticket>(tickets.getContent()));
        return resultFinal;
    }

    public List<Ticket> findIsOpenUntilDate(Date lastDate) {
        return IteratorUtils.toList(repository.findIsOpenUntilDate(lastDate).iterator());
    }

    public List<Ticket> findBetweenStartDate(Date firstDate, Date lastDate) {
        return IteratorUtils.toList(repository.findBetweenStartDate(firstDate, lastDate).iterator());
    }

    public List<Ticket> findBetweenEndDate(Date firstDate, Date lastDate) {
        return IteratorUtils.toList(repository.findBetweenEndDate(firstDate, lastDate).iterator());
    }

    public List<Ticket> findIsOpenUntilDateAndCategorySomeAlreadyClosed(Date lastDate, long categoryId) {
        return IteratorUtils.toList(repository.findIsOpenUntilDateAndCategorySomeAlreadyClosed(lastDate, categoryId).iterator());
    }

    public List<Ticket> findIsOpenUntilDateAndCategory(Date lastDate, long categoryId) {
        return IteratorUtils.toList(repository.findIsOpenUntilDateAndCategory(lastDate, categoryId).iterator());
    }

    public List<Ticket> findBetweenStartDateAndCategory(Date firstDate, Date lastDate, long categoryId) {
        return IteratorUtils.toList(repository.findBetweenStartDateAndCategory(firstDate, lastDate, categoryId).iterator());
    }

    public List<Ticket> findBetweenEndDateAndCategory(Date firstDate, Date lastDate, long categoryId) {
        return IteratorUtils.toList(repository.findBetweenEndDateAndCategory(firstDate, lastDate, categoryId).iterator());
    }

    public List<Ticket> findIsOpenUntilDateAndClientSomeAlreadyClosed(Date lastDate, long clientId) {
        return IteratorUtils.toList(repository.findIsOpenUntilDateAndClientSomeAlreadyClosed(lastDate, clientId).iterator());
    }

    public List<Ticket> findIsOpenUntilDateAndClient(Date lastDate, long clientId) {
        return IteratorUtils.toList(repository.findIsOpenUntilDateAndClient(lastDate, clientId).iterator());
    }

    public List<Ticket> findBetweenStartDateAndClient(Date firstDate, Date lastDate, long clientId) {
        return IteratorUtils.toList(repository.findBetweenStartDateAndClient(firstDate, lastDate, clientId).iterator());
    }

    public List<Ticket> findBetweenEndDateAndClient(Date firstDate, Date lastDate, long clientId) {
        return IteratorUtils.toList(repository.findBetweenEndDateAndClient(firstDate, lastDate, clientId).iterator());
    }

    public List<Ticket> findIsOpenUntilDateAndUser(Date lastDate, long userId) {
        return IteratorUtils.toList(repository.findIsOpenUntilDateAndUser(lastDate, userId).iterator());
    }

    public List<Ticket> findBetweenStartDateAndUser(Date firstDate, Date lastDate, long userId) {
        return IteratorUtils.toList(repository.findBetweenStartDateAndUser(firstDate, lastDate, userId).iterator());
    }

    public List<Ticket> findBetweenEndDateAndUser(Date firstDate, Date lastDate, long userId) {
        return IteratorUtils.toList(repository.findBetweenEndDateAndUser(firstDate, lastDate, userId).iterator());
    }

    public List<Ticket> findByIsOpenAndResponsibleNotNull(Boolean isOpen) {
        return IteratorUtils.toList(repository.findByIsOpenAndResponsibleNotNull(isOpen).iterator());
    }

    public List<Ticket> orderByWaitingAndLastInteration(List<Ticket> list, User user) {
        List<Ticket> result = new ArrayList<Ticket>();
        if (list != null) {
            if (user != null) {
                // lista somente com os tickets aguardando resposta.
                List<Ticket> listWaiting = getListByWaiting(list, user);

                // removendo da lista geral os tickets aguardando resposta.
                list.removeAll(listWaiting);

                // ordenando lista com os tickets aguardando resposta.
                listWaiting = orderByLastInteration(listWaiting);

                // ordenando lista com os tickets que não estão aguardando resposta.
                list = orderByLastInteration(list);

                result.addAll(listWaiting);
                result.addAll(list);
            } else {
                result.addAll(list);
            }
        }
        return result;
    }

    public List<Ticket> getListByWaiting(List<Ticket> list, User user) {
        List<Ticket> result = new ArrayList<Ticket>();
        if (list != null && user != null) {
            boolean userIsAdmin = false;
            boolean userLastIsAdmin = false;
            boolean insert = false;
            User userLast = null;

            List<User> listAdmin = userService.findByUserAdmin();
            for (User admin : listAdmin) {
                if (user.getId().equals(admin.getId())) {
                    userIsAdmin = true;
                }
            }

            for (Ticket ticket : list) {
                // usuário da ultima interação do ticket.
                userLast = ticket.getUserLastInteration();

                // verifica se o usuário da última interação é diferente do usuário logado.
                if (!userLast.getId().equals(user.getId())) {
                    if (userIsAdmin) {
                        // verifica se o usuário da última interação é admin.
                        for (User admin : listAdmin) {
                            if (userLast.getId().equals(admin.getId())) {
                                userLastIsAdmin = true;
                            }
                        }
                        // verifica se alguns dos dois usuários não é usuário admin.
                        if ((!userIsAdmin) || (!userLastIsAdmin)) {
                            if (!user.getId().equals(userLast.getId())) {
                                insert = true;
                            }
                        }
                    } else {
                        // se o usuário logado não for admin, verifica se o usuário da última interação é o mesmo.
                        if (!user.getId().equals(userLast.getId())) {
                            insert = true;
                        }
                    }
                }
                if (insert) {
                    result.add(ticket);
                }
                userLastIsAdmin = false;
                insert = false;
            }
        }
        return result;
    }

    public List<Ticket> orderByLastInteration(List<Ticket> list) {
        Collections.sort(list, new Comparator<Ticket>() {
            @Override
            public int compare(Ticket o1, Ticket o2) {
                if (o1.getLastInteration() != null && o2.getLastInteration() != null) {
                    return (o1.getLastInteration().getTime() > o2.getLastInteration().getTime() ? -1 : 1);
                }
                return 0;
            }
        });
        return list;
    }

}
