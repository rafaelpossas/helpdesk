package com.br.helpdesk.integration;

import com.br.helpdesk.model.Attachments;
import com.br.helpdesk.service.AttachmentsService;
import com.github.springtestdbunit.DbUnitTestExecutionListener;
import com.github.springtestdbunit.annotation.DatabaseSetup;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;
import org.springframework.test.context.web.WebAppConfiguration;
import static org.junit.Assert.assertThat;
import static org.hamcrest.Matchers.*;
import java.util.List;

/**
 * Created by rafaelpossas on 5/23/15.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(locations = {"file:src/main/webapp/WEB-INF/configuration/application.xml",
    "file:src/main/webapp/WEB-INF/configuration/database_test.xml", "file:src/main/webapp/WEB-INF/configuration/security.xml"})
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class,
    DirtiesContextTestExecutionListener.class,
    TransactionalTestExecutionListener.class,
    DbUnitTestExecutionListener.class})
@DatabaseSetup(value = "CompleteData.xml")
public class AttachmentIntegrationTest {

    @Autowired
    private AttachmentsService attachmentsService;

    @Test
    public void TestFindByTicket() throws Exception{
        List<Attachments> result = attachmentsService.findByAnswerWithoutFile(75L);
        assertThat(result.size(),is(0));

    }
}
