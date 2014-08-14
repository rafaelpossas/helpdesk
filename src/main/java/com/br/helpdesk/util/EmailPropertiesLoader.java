/*
* To change this license header, choose License Headers in Project Properties.
* To change this template file, choose Tools | Templates
* and open the template in the editor.
*/

package com.br.helpdesk.util;

/**
*
* @author Andre
*/

import java.io.File;
import java.net.URL;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URL;
import java.util.Properties;

public class EmailPropertiesLoader {    
 
    //Crio uma instancia da classe properties
    private static Properties prop = new Properties();
     
    //Crio um método estático que pode ser acessado por outras classes da aplicação sem a necessidade de instanciar
     public static Properties propertiesLoader() {
       try {   //Tento recuperar as informações do arquivo de propriedades        
           ClassLoader classloader = Thread.currentThread().getContextClassLoader();
           URL resource = classloader.getResource("mail.properties");
           File file = new File(resource.toURI());
    
           //Agora crio uma instância de FileInputStream passando via construtor o objeto file instanciado acima
           FileInputStream fileInputStream = new FileInputStream(file);

          //Crio uma instancia da classe properties
           //Leio o fileInputStream recuperando assim o mapa contendo chaves e valores
           prop.load(fileInputStream);
           //Fecho o fileInputStream
           
           fileInputStream.close();           
       } catch (Exception e) {
           //Trato possíveis exceções
       }
       return prop;
       //Retorno um objeto prop com o mapa correspondente ao meu arquivo properties
   }
}