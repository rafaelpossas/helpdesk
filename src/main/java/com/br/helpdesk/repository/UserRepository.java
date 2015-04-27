package com.br.helpdesk.repository;

import com.br.helpdesk.model.User;
import java.util.Date;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

/**
 * Created with IntelliJ IDEA.
 * User: rafaelpossas
 * Date: 10/18/13
 * Time: 4:32 PM
 * To change this template use File | Settings | File Templates.
 */
public interface UserRepository extends CrudRepository<User,Long> {
    User findByUserName(String username);
    User findByEmail(String email);
    User findByName(String name);
    
    @Query("Select u FROM User u WHERE u.userGroup.id=1")
    public List<User> findByUserAdmin(); 
    
    @Query("Select u FROM User u WHERE u.client.id in :groupClients")
    public List<User> findByGroupClient(@Param("groupClients") List<Long> groupClients);   
}
