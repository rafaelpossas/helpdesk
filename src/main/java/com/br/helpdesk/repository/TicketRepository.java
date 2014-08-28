package com.br.helpdesk.repository;

import com.br.helpdesk.model.Ticket;
import com.br.helpdesk.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Created with IntelliJ IDEA. User: rafaelpossas Date: 13/10/13 Time: 09:07 To
 * change this template use File | Settings | File Templates.
 */
public interface TicketRepository extends CrudRepository<Ticket, Long> {

    List<Ticket> findByIsOpen(Boolean isOpen);

    List<Ticket> findByIsOpenOrderByIdDesc(Boolean isOpen, Pageable pageable);

    List<Ticket> findByIsOpenAndUser(Boolean isOpen, User user);

    List<Ticket> findByIsOpenAndUserOrderByIdDesc(Boolean isOpen, User user, Pageable pageable);

    List<Ticket> findByUser(User user);

    List<Ticket> findByUserOrderByIdDesc(User user, Pageable pageable);

    List<Ticket> findByResponsibleAndIsOpen(User user, Boolean isOpen);

    List<Ticket> findByResponsibleAndIsOpenOrderByIdDesc(User user, Boolean isOpen, Pageable pageable);
    
    List<Ticket> findByIsOpenAndResponsibleNotNullOrderByIdDesc(Boolean isOpen, Pageable pageable);
    
    List<Ticket> findByIsOpenAndResponsibleNotNull(Boolean isOpen);
    
    Page<Ticket> findAll(Pageable pageable);

    @Query(
            "Select count(t) FROM Ticket t"
    )
    Long countByFindAll();
    
    Long countByIsOpenAndResponsibleNotNull(Boolean isOpen);
    
    Long countByIsOpen(Boolean isOpen);
    
    Long countByResponsibleAndIsOpen(User user, Boolean isOpen);
    
    Long countByUser(User user);
    
    Long countByIsOpenAndUser(Boolean isOpen, User user);   

    @Query(
            "Select t FROM Ticket t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
            + "OR LOWER(t.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))"
    )
    public List<Ticket> search(@Param("searchTerm") String searchTerm);

    @Query(
            "Select count(t) FROM Ticket t WHERE t.user.id= :userId"
    )
    public Long getTicketsPerUser(@Param("userId") Long userId);

    @Query(
            "Select t FROM Ticket t WHERE (t.startDate is not null) and (t.startDate between :startDate_1 and :startDate_2) and (t.endDate is not null) and (t.endDate between :endDate_1 and :endDate_2)"
    )
    public List<Ticket> findBetweenDates(@Param("startDate_1") Date startDate_1, @Param("startDate_2") Date startDate_2, @Param("endDate_1") Date endDate_1, @Param("endDate_2") Date endDate_2);

    @Query(
            "Select t FROM Ticket t WHERE (t.startDate is not null) and (t.startDate between :firstDate and :lastDate)"
    )
    public List<Ticket> findBetweenStartDate(@Param("firstDate") Date firstDate, @Param("lastDate") Date lastDate);

    @Query(
            "Select t FROM Ticket t WHERE (t.endDate is not null) and (t.endDate between :firstDate and :lastDate)"
    )
    public List<Ticket> findBetweenEndDate(@Param("firstDate") Date firstDate, @Param("lastDate") Date lastDate);

    @Query(
            "Select t FROM Ticket t WHERE (t.endDate is null) and (t.startDate <= :lastDate)"
    )
    public List<Ticket> findIsOpenUntilDate(@Param("lastDate") Date lastDate);

    /**
     * Retorna a lista de tickets que foram abertos antes da data enviada por parâmetro. 
     * <br> Mesmo que o ticket já tenha sido fechado, ele entrará na resultado se a data de fechamento do mesmo 
     * <br> for maior que a data enviada por parâmetro.
     * @param lastDate
     * @param categoryId
     * @return 
     */
    @Query(
            "Select t FROM Ticket t WHERE ((t.endDate is null) or ((t.endDate is not null) and (t.endDate >= :lastDate))) and (t.startDate <= :lastDate) and t.category.id = :categoryId"
    )
    public List<Ticket> findIsOpenUntilDateAndCategorySomeAlreadyClosed(@Param("lastDate") Date lastDate, @Param("categoryId") long categoryId);
    
     /**
     * Retorna a lista de tickets que foram abertos antes da data enviada por parâmetro.  
     * <br> Só retorna tickets que ainda estão em aberto.
     * @param lastDate
     * @param categoryId
     * @return 
     */
    @Query(
            "Select t FROM Ticket t WHERE (t.endDate is null) and (t.startDate <= :lastDate) and t.category.id = :categoryId"
    )
    public List<Ticket> findIsOpenUntilDateAndCategory(@Param("lastDate") Date lastDate, @Param("categoryId") long categoryId);

    @Query(
            "Select t FROM Ticket t WHERE (t.startDate is not null) and (t.startDate between :firstDate and :lastDate) and t.category.id = :categoryId"
    )
    public List<Ticket> findBetweenStartDateAndCategory(@Param("firstDate") Date firstDate, @Param("lastDate") Date lastDate, @Param("categoryId") long categoryId);

    @Query(
            "Select t FROM Ticket t WHERE (t.endDate is not null) and (t.endDate between :firstDate and :lastDate) and t.category.id = :categoryId"
    )
    public List<Ticket> findBetweenEndDateAndCategory(@Param("firstDate") Date firstDate, @Param("lastDate") Date lastDate, @Param("categoryId") long categoryId);

    /**
     * Retorna a lista de tickets que foi aberta antes da data enviada por parâmetro. 
     * <br> Mesmo que o ticket já tenha sido fechado, ele entrará na resultado se a data de fechamento do mesmo 
     * <br> for maior que a data enviada por parâmetro.
     * @param lastDate
     * @param clientId
     * @return 
     */
    @Query(
            "Select t FROM Ticket t WHERE ((t.endDate is null) or ((t.endDate is not null) and (t.endDate >= :lastDate))) and (t.startDate <= :lastDate) and t.client.id = :clientId"
    )
    public List<Ticket> findIsOpenUntilDateAndClientSomeAlreadyClosed(@Param("lastDate") Date lastDate, @Param("clientId") long clientId);
    
    /**
     * Retorna a lista de tickets que foi aberta antes da data enviada por parâmetro. 
     * <br> Só retorna tickets que ainda estão em aberto.
     * @param lastDate
     * @param clientId
     * @return 
     */
    @Query(
            "Select t FROM Ticket t WHERE (t.endDate is null) and (t.startDate <= :lastDate) and t.client.id = :clientId"
    )
    public List<Ticket> findIsOpenUntilDateAndClient(@Param("lastDate") Date lastDate, @Param("clientId") long clientId);

    @Query(
            "Select t FROM Ticket t WHERE (t.startDate is not null) and (t.startDate between :firstDate and :lastDate) and t.client.id = :clientId"
    )
    public List<Ticket> findBetweenStartDateAndClient(@Param("firstDate") Date firstDate, @Param("lastDate") Date lastDate, @Param("clientId") long clientId);

    @Query(
            "Select t FROM Ticket t WHERE (t.endDate is not null) and (t.endDate between :firstDate and :lastDate) and t.client.id = :clientId"
    )
    public List<Ticket> findBetweenEndDateAndClient(@Param("firstDate") Date firstDate, @Param("lastDate") Date lastDate, @Param("clientId") long clientId);

    @Query(
            "Select t FROM Ticket t WHERE (t.endDate is null) and (t.startDate <= :lastDate) and t.user.id = :userId"
    )
    public List<Ticket> findIsOpenUntilDateAndUser(@Param("lastDate") Date lastDate, @Param("userId") long userId);

    @Query(
            "Select t FROM Ticket t WHERE (t.startDate is not null) and (t.startDate between :firstDate and :lastDate) and t.user.id = :userId"
    )
    public List<Ticket> findBetweenStartDateAndUser(@Param("firstDate") Date firstDate, @Param("lastDate") Date lastDate, @Param("userId") long userId);

    @Query(
            "Select t FROM Ticket t WHERE (t.endDate is not null) and (t.endDate between :firstDate and :lastDate) and t.user.id = :userId"
    )
    public List<Ticket> findBetweenEndDateAndUser(@Param("firstDate") Date firstDate, @Param("lastDate") Date lastDate, @Param("userId") long userId);

    //SEARCH QUERYS
    
    //SEARCH ALL
    @Query(
           "Select t FROM Ticket t WHERE t.user.id = :userId "
                    + "AND (LOWER(t.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.id) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.client.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.user.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.category.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR DATE_FORMAT(t.lastInteration, '%d/%m/%Y') LIKE CONCAT('%', :searchTerm, '%')) "
    )
    public Page<Ticket> searchType1(@Param("userId") Long userId,@Param("searchTerm") String searchTerm,Pageable pageable);
    
    //SEARCH ALL SUPERUSER
    @Query(
            "Select t FROM Ticket t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.id) LIKE LOWER(CONCAT('%', :searchTerm, '%'))"
                    + "OR LOWER(t.client.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))"
                    + "OR LOWER(t.user.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))"
                    + "OR LOWER(t.category.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))"
                    + "OR DATE_FORMAT(t.lastInteration, '%d/%m/%Y') LIKE CONCAT('%', :searchTerm, '%') "
    )
    public Page<Ticket> searchType1Superuser(@Param("searchTerm") String searchTerm,Pageable pageable);
    
    //SEARCH MY TICKETS
    @Query(
           "Select t FROM Ticket t WHERE t.responsible.id = :userId "
                    + "AND (LOWER(t.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.id) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.client.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.user.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.category.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR DATE_FORMAT(t.lastInteration, '%d/%m/%Y') LIKE CONCAT('%', :searchTerm, '%')) "
    )
    public Page<Ticket> searchType2(@Param("userId") Long userId,@Param("searchTerm") String searchTerm,Pageable pageable);
    
    //SEARCH WITHOUT RESPONSIBLE
    @Query(
            "Select t FROM Ticket t WHERE t.responsible IS NULL "
                    + "AND (t.isOpen = true) "
                    + "AND (LOWER(t.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR t.id LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.client.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.user.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.category.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR DATE_FORMAT(t.lastInteration, '%d/%m/%Y') LIKE CONCAT('%', :searchTerm, '%')) "
    )
    public Page<Ticket> searchType3(@Param("searchTerm") String searchTerm,Pageable pageable);

    //SEARCH ISOPEN AND HAS RESPONSIBLE
    @Query(
            "Select t FROM Ticket t WHERE t.responsible IS NOT NULL "
                    + "AND (t.isOpen = :isOpen) "
                    + "AND (LOWER(t.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.id) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.client.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.user.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.category.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR DATE_FORMAT(t.lastInteration, '%d/%m/%Y') LIKE CONCAT('%', :searchTerm, '%')) "
    )
    public Page<Ticket> searchType4(@Param("isOpen") Boolean isOpen, @Param("searchTerm") String searchTerm,Pageable pageable);
    
    //SEARCH ISOPEN FROM USER
    @Query(
            "Select t FROM Ticket t WHERE t.user.id = :userId "
                    + "AND (t.isOpen = :isOpen) "
                    + "AND (LOWER(t.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.id) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.client.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.user.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.category.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR DATE_FORMAT(t.lastInteration, '%d/%m/%Y') LIKE CONCAT('%', :searchTerm, '%')) "
    )
    public Page<Ticket> searchType5(@Param("userId") Long userId, @Param("isOpen") Boolean isOpen, @Param("searchTerm") String searchTerm,Pageable pageable);
    
    //SEARCH ISOPEN ONLY
    @Query(
            "Select t FROM Ticket t WHERE t.isOpen = :isOpen "
                    + "AND (LOWER(t.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.id) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.client.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.user.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR LOWER(t.category.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
                    + "OR DATE_FORMAT(t.lastInteration, '%d/%m/%Y') LIKE CONCAT('%', :searchTerm, '%')) "
    )
    public Page<Ticket> searchType6(@Param("isOpen") Boolean isOpen, @Param("searchTerm") String searchTerm,Pageable pageable);
}
