package com.br.helpdesk.service;

import com.br.helpdesk.model.EmailConfig;
import com.br.helpdesk.repository.EmailConfigRepository;
import javax.annotation.Resource;
import org.springframework.stereotype.Service;

@Service
public class EmailConfigService{
    
    @Resource
    private EmailConfigRepository repository;
    
    public void setRepository(EmailConfigRepository repository) {
        this.repository = repository;
    }
    public EmailConfig save(EmailConfig classe) {
        return repository.save(classe);
    }

    public void remove(EmailConfig classe) {
        repository.delete(classe);
    }

    public EmailConfig findById(Long codigo) {
        return repository.findOne(codigo);
    }    
}
