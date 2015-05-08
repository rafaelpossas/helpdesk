/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.model.EmailConfig',{
   extend: 'Ext.data.Model',
   idProperty: 'id',
   fields: [
       {name: 'smtpHost'},
       {name: 'socketFactoryPort'},
       {name: 'auth'},
       {name: 'smtpPort'},
       {name: 'userEmail'},
       {name: 'password'},
       {name: 'imap'},
       {name: 'marketingSmtpHost'},
       {name: 'marketingUserEmail'},
       {name: 'marketingPassword'}
   ]
});

