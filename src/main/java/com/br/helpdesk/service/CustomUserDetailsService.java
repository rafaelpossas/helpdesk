/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.br.helpdesk.service;

import com.br.helpdesk.model.User;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 *
 * @author rafaelpossas
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserService userService;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.findByUserNameWithPassword(username);
        if(user == null){
            throw new UsernameNotFoundException("User not found");
        }
        try {
            boolean accountNonExpired = true;
            boolean accountNonLocked = true;
            return new org.springframework.security.core.userdetails.User(
                            user.getUserName(), 
                            user.getPassword(),
                            user.getIsEnabled(),
                            accountNonExpired,
                            user.getCredentialsNonExpired(),
                            accountNonLocked,
                            getRoles());

        } catch (Exception e) {
                throw new RuntimeException(e);
        }
    }
    private List<GrantedAuthority> getRoles(){
        List<GrantedAuthority> roles = new ArrayList<GrantedAuthority>();
        roles.add(new SimpleGrantedAuthority("USER"));
        return roles;
    }
    
}
