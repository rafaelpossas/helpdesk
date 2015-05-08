/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.repository;

import com.br.helpdesk.model.EmailConfig;
import org.springframework.data.repository.CrudRepository;

/**
 *
 * @author André Sulivam
 */
public interface EmailConfigRepository extends CrudRepository<EmailConfig, Long> {

    EmailConfig findByMarketingSmtpHost(String marketingSmtpHost);

}
