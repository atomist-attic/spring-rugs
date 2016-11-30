package com.atomist.springrest;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.web.client.RestTemplate;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = SpringRestApplication.class, webEnvironment = WebEnvironment.DEFINED_PORT)
public class SpringRestWebIntegrationTests {

  private static final int PORT = 8080;

    // Parameterize tests like this
    private static final String AN_APP_PATH = "http://localhost:" + PORT + "/path";

    // Use this to run tests
    private RestTemplate restTemplate = new RestTemplate();

    @Test
    public void sampleTest() {
        // Use RestTemplate to hit chosen URLs
    }
 }
