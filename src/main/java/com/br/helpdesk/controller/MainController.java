package com.br.helpdesk.controller;

import com.Consts;
import com.br.helpdesk.model.Client;
import com.br.helpdesk.model.User;
import com.br.helpdesk.model.UserGroup;
import com.br.helpdesk.repository.ClientRepository;
import com.br.helpdesk.repository.TicketRepository;
import com.br.helpdesk.repository.UserGroupRepository;
import com.br.helpdesk.repository.UserRepository;
import com.br.helpdesk.service.EmailService;
import com.br.helpdesk.service.UserService;
import java.io.UnsupportedEncodingException;
import java.util.List;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/")
public class MainController {

    //public static final String BAD_CREDENTIALS = "badcredentials";
   // public static final String CREDENTIALS_EXPIRED = "credentialsexpired";
   // public static final String ACCOUNT_LOCKED = "accountlocked";
   // public static final String ACCOUNT_DISABLED = "accountdisabled";
    @Resource
    private ClientRepository clientRepository;    
    @Resource
    private UserGroupRepository userGroupRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private EmailService emailService;
    
    @RequestMapping(value="/credentials",method = RequestMethod.POST)
    public void saveCredentials(HttpServletRequest request, HttpServletResponse response) throws Exception{
        String newPassword = request.getParameter("new_password");
        String userString = request.getParameter("user");
        User user = userService.findByUserName(userString);
        user.setCredentialsNonExpired(Boolean.TRUE);
        user.setPassword(newPassword);
        userService.save(user);
    }
    @RequestMapping(value="/login",method = RequestMethod.POST)
    @ResponseBody
    public User createFromLogin(@RequestBody String user) throws Exception {
        JSONObject jsObject = new JSONObject(user);
        User newUsuario = new User();
        List<Client> clients = clientRepository.findByNameContaining((String)jsObject.get("client"));
        Client client = null;
        if(clients == null || clients.size() == 0){
            //CRIAR NOVO CLIENT
            client = new Client();
            client.setName((String)jsObject.get(Consts.CLIENT));
            client = clientRepository.save(client);
        }
        else{
            client = clients.get(0);
        }
        //USER GROUP 
        //1 - SUPERUSUARIO 
        //2 - CLIENTE
        UserGroup ug = userGroupRepository.findOne(new Long(2));
        
        newUsuario.setName((String)jsObject.get(Consts.NAME));
        newUsuario.setEmail((String)jsObject.get(Consts.EMAIL));
        newUsuario.setIsEnabled(true);
        newUsuario.setPassword((String)jsObject.get(Consts.PASSWORD));
        newUsuario.setUserName((String)jsObject.get(Consts.USERNAME));
        newUsuario.setClient(client);
        newUsuario.setUserGroup(ug);
        newUsuario.setCredentialsNonExpired(true);
        newUsuario = userService.save(newUsuario);
        //return user;
        return newUsuario;
    }
    
    @RequestMapping(value = "/login/validuser", method = RequestMethod.POST, params={"username"})
    public @ResponseBody
    Boolean userValidation(@RequestParam(value = "username") String username) {
        User user = userService.findByUserName(username);
        if(user != null)
            return false;
        return true;
    }
    
    @RequestMapping(method = RequestMethod.GET)
    public ModelAndView getHome() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView modelAndView = new ModelAndView(Consts.HOME);
        User user = userService.findByUserName(auth.getName());
        JSONObject jsObject = new JSONObject(user);
        jsObject.remove("password");
        
        modelAndView.addObject(Consts.LOGGED, true);
        modelAndView.addObject(Consts.USER_LOGGED, jsObject.toString().replace("\"", "\'"));
        
        return modelAndView;
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public ModelAndView getLogin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView modelAndView = new ModelAndView(Consts.LOGIN);
        if (!auth.getName().equals(Consts.ANONYMOUS_USER)) {
            User user = userService.findByUserName(auth.getName());
            modelAndView.addObject(Consts.USER, auth.getName());
            modelAndView.addObject(Consts.LOGGED, true);
            modelAndView.addObject(Consts.CLIENT, user.getClient().getId());
            modelAndView.addObject(Consts.EMAIL, user.getEmail());
        } else {
            modelAndView.addObject(Consts.LOGGED, false);
            modelAndView.addObject(Consts.USER, Consts.ANONYMOUS_USER);
            modelAndView.addObject(Consts.CLIENT, Consts.NONE);
        }
        return modelAndView;
    }

    @RequestMapping(value = "/loginsuccessful")
    public @ResponseBody
    String loginSuccessful() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String name = auth.getName(); //get logged in username
        return "{success: true,username: \'" + name + "\'}";
    }

    @RequestMapping(value = "/login/{error}")
    public @ResponseBody
    String displayLoginform(@PathVariable final String error) {
        return "{success: false,error: \'" + error + "\'}";
    }
    
    @RequestMapping(value="/login/reset-password", params = {"username","language"}, method = RequestMethod.GET,produces = "application/json;charset=UTF-8")
    public @ResponseBody         
    String retrievePassword(@RequestParam(value = "username") String username,@RequestParam(value = "language") String language, HttpServletResponse response) throws UnsupportedEncodingException, Exception {
        
        String result = "";
        username = username.replace("username=", "");       
        
        if(username!=null && !username.equals("")){            
            User user = userService.findByUserName(username);
            //Se o usuário existir, sua senha será substituida e um e-mail será enviado para o mesmo.
            //Se não, o método retornará a mensagem referente a situação.
            if(user!=null){
                user.setPassword(generatePassword());
                userService.save(user);
                emailService.sendEmailPasswordChanged(user,language);
                result = "{\"success\": \"true\",\"status\":\"change-password-complete\"}";
            }else{
                result += "{\"success\": \"true\",\"status\":\"invalid-username\"}";
            }            
        }       
        return result;
    }
    
    
    public String generatePassword(){
        String senha="";       
        
        String[] carct ={"0","1","2","3","4","5","6","7","8","9","a","b","c","d","e",
            "f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w",
            "x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O",
            "P","Q","R","S","T","U","V","W","X","Y","Z"};
        
        for (int x=0; x<10; x++){
            int j = (int) (Math.random()*carct.length);
            senha += carct[j];
        }       
        return senha;
    }
    

}
