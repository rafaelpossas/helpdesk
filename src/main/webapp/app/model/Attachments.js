/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.model.Attachments',{
   extend: 'Ext.data.Model',
   idProperty: 'id',
   fields: [       
        {name: 'name'},
        {name: 'ticket'},
        {name: 'ticketAnswer'},
        {name: 'byteArquivo'},
        {name: 'contentType'}       
   ]
});

