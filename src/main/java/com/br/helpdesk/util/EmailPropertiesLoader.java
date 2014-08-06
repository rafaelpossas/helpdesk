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
import java.io.FileInputStream;
import java.util.Properties;
 
public class EmailPropertiesLoader {    
 
    //Crio uma instancia da classe properties
    private static Properties prop = new Properties();
     
    //Crio um método estático que pode ser acessado por outras classes da aplicação sem a necessidade de instanciar
    public static Properties propertiesLoader() {
        String dir = "C:\\Users\\Andre\\Documents\\bitbucket\\HelpDesk\\src\\main\\resources\\mail.properties";
        try {   //Tento recuperar as informações do arquivo de propriedades        
            
            //Crio uma instância de File passando o meu arquivo .properties via construtor
            
            File file = new File(dir);            
            //Agora crio uma instância de FileInputStream passando via construtor o objeto file instanciado acima
            FileInputStream fileInputStream = new FileInputStream(file);

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