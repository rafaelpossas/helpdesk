/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.store.SendEmails', {
    extend: 'Helpdesk.store.BasicStore',
    storeId: 'sendEmails',
    fields: [],
    autoLoad: false,
    constructor: function(config) {
        // applyIf means only copy if it doesn't exist
        Ext.applyIf(config, {
            proxy: Ext.create('Helpdesk.proxy.Base', {
                url: 'sendemail'
            })
        });
        this.callParent([config]);
    },
    sendEmail: function(callbackfunction, subject, message, groupClient, scope) {        
        $.ajax({
            type: 'POST',
            data: {
                subject: subject,
                message: message,
                groupClient: groupClient
            },
            url: 'sendemail',
            success: Ext.bind(callbackfunction, scope)
        });
    },
    getJsonEmailUsers: function(callbackfunction, groupClient, scope) {        
        $.ajax({
            type: 'POST',
            data: {
                groupClient: groupClient
            },
            url: 'sendemail',
            success: Ext.bind(callbackfunction, scope)
        });
    },
    sendEmailSingle: function(callbackfunction, subject, message, emailUser, id) {
        $.ajax({
            type: 'POST',
            data: {
                subject: subject,
                message: message,
                emailUser: emailUser,
                id: id
            },
            url: 'sendemail',
            success: Ext.bind(callbackfunction)
        });
    }
});