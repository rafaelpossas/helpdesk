package com.br.helpdesk.integration;

import com.br.helpdesk.controller.EmailConfigController;
import com.br.helpdesk.repository.EmailConfigRepository;
import com.br.helpdesk.model.EmailConfig;
import com.br.helpdesk.service.EmailConfigService;
import com.br.helpdesk.util.TestUtil;
import com.github.springtestdbunit.DbUnitTestExecutionListener;
import com.github.springtestdbunit.annotation.DatabaseSetup;
import static org.hamcrest.Matchers.is;
import org.json.JSONObject;
import static org.junit.Assert.assertThat;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(locations = {"file:src/main/webapp/WEB-INF/configuration/application.xml",
    "file:src/main/webapp/WEB-INF/configuration/database_test.xml", "file:src/main/webapp/WEB-INF/configuration/security.xml"})
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class,
    DirtiesContextTestExecutionListener.class,
    TransactionalTestExecutionListener.class,
    DbUnitTestExecutionListener.class})
@DatabaseSetup("CompleteData.xml")
public class EmailConfigIntegrationTest {

    private MockMvc mockMvc;

    @Autowired
    private EmailConfigRepository repository;

    @Autowired
    private EmailConfigService service;

    @InjectMocks
    private EmailConfigController controller;

    /**
     * @author Andre Sulivam - Cria o servico e o repositorio reais, - Cria um
     * mock do controller
     */
    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        service.setRepository(repository);
        controller.setService(service);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    public void testFindByIdEntityNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/emailconfig/{id}", 50L))
                .andExpect(MockMvcResultMatchers.status().isNotFound());//verifica se o retorno � entityNotFound    
    }

    @Test
    public void testFindByIdOk() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/emailconfig/{id}", 1L))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se o retorno � ok 
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8;  
                .andReturn();

        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONObject jsonObject = new JSONObject(contentString);//transforma o JSON String para JsonObject

        //verificando se o objeto possui os dados esperados
        assertThat(jsonObject.get("id").toString(), is("1"));
        assertThat(jsonObject.getString("smtpHost"), is("smtp.gmail.com"));
    }

    @Test
    public void testDeleteEntityNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/emailconfig/{id}", 50L))
                .andExpect(MockMvcResultMatchers.status().isNotFound());//verifica se o retorno � entityNotFound    
    }

    @Test
    public void testDeleteEntity() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/emailconfig/{id}", 1L))
                .andExpect(MockMvcResultMatchers.status().isOk());//verifica se o retorno � entityNotFound    
    }

    @Test
    public void testSaveNewEntity() throws Exception {
        EmailConfig emailConfig = new EmailConfig();
        emailConfig.setAuth("false");
        emailConfig.setImap("imap");
        emailConfig.setUserEmail("afas");
        emailConfig.setPassword("123");

        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.put("/emailconfig")
                .content(TestUtil.convertObjectToJsonBytes(emailConfig))
                .contentType(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se o retorno � entityNotFound    
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8;
                .andReturn();

        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONObject jsonObject = new JSONObject(contentString);//transforma o JSON String para JsonObject

        //verificando se o objeto possui os dados esperados
        assertThat(jsonObject.getInt("id"), is(2));
        assertThat(jsonObject.getString("password"), is("123"));
    }

    @Test
    public void testSaveChangeEntity() throws Exception {
        EmailConfig emailConfig = new EmailConfig();
        emailConfig.setId(1L);
        emailConfig.setSmtpHost("New Config Email");

        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.put("/emailconfig")
                .content(TestUtil.convertObjectToJsonBytes(emailConfig))
                .contentType(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se o retorno � entityNotFound    
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8;
                .andReturn();

        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONObject jsonObject = new JSONObject(contentString);//transforma o JSON String para JsonObject

        //verificando se o objeto possui os dados esperados
        assertThat(jsonObject.get("id").toString(), is("1"));
        assertThat(jsonObject.getString("smtpHost"), is("New Config Email"));
    }
    
}
