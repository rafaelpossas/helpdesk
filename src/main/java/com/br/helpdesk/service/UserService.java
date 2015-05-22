package com.br.helpdesk.service;

import com.br.helpdesk.model.User;
import com.br.helpdesk.repository.UserRepository;
import java.util.List;
import javax.annotation.Resource;
import org.apache.commons.collections.IteratorUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Resource
    private UserRepository repository;

    public void setRepository(UserRepository repository) {
        this.repository = repository;
    }

    @Autowired
    private EmailService emailService;

    public void setEmailService(EmailService service) {
        this.emailService = service;
    }

    public User save(User model) throws Exception {
        User userTemp = null;
        // caso usuário já exista no banco
        if ((model.getId() != null && model.getId() > 0)) {
            // pesquisa o usuário salvo no banco para setar a senha antiga ao usuário que está sendo salvo.
            userTemp = repository.findOne(model.getId());
            if(model.getPassword() == null || model.getPassword().equals("")){
                model.setPassword(userTemp.getPassword());
            }
        }
        model = repository.save(model);
        if (userTemp == null) {
            // usuario novo - Enviar email aos administradores e ao próprio usuário com os dados de cadastro.
            try{
                emailService.sendEmailNewUserCreated(model);
            }catch(Exception e){
                e.printStackTrace();
            }            
        }
        model = (User) removePassword(null, model);
        return model;
    }

    public List<User> findAll() {
        List<User> list = IteratorUtils.toList(repository.findAll().iterator());
        if (list != null && list.size() > 0) {
            list = (List) removePassword(list, null);
        }
        return list;
    }

    public void delete(User model) {
        repository.delete(model);
    }

    public User findByUserName(String username) {
        User user = repository.findByUserName(username);
        user = (User) removePassword(null, user);
        return user;
    }

    public User findByUserNameWithPassword(String userName) {
        User user = repository.findByUserName(userName);
        return user;
    }

    public User findById(Long codigo) {
        User user = repository.findOne(codigo);
        user = (User) removePassword(null, user);
        return user;
    }

    public List<User> findByUserAdmin() {
        List<User> list = repository.findByUserAdmin();
        list = (List) removePassword(list, null);
        return list;
    }

    public User findByEmail(String email) {
        User user = repository.findByEmail(email);
        user = (User) removePassword(null, user);
        return user;
    }

    public User findByName(String name) {
        User user = repository.findByName(name);
        user = (User) removePassword(null, user);
        return user;
    }

    /**
     * Remover o atributo de password dos usuário para retornar a requisição.
     * <br>
     * Recebe uma lista de usuários ou um usuário apenas.
     *
     * @param list
     * @param user
     * @return
     */
    public Object removePassword(List<User> list, User user) {
        // caso seja uma lista de usuário, retira a senha de todos e retorna a lista
        if (list != null && list.size() > 0) {
            for (User userTemp : list) {
                userTemp.setPassword("");
            }
            return list;
            // caso seja apenas um usuário, retira a senha do mesmo e retorna.
        } else if (user != null) {
            user.setPassword("");
            return user;
        }
        return null;
    }

    public List<User> findByGroupClient(List<Long> idClients) {
        List<User> list = repository.findByGroupClient(idClients);
        return list;
    }
}
