/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.apply(Ext.form.VTypes, {    
    password : function(val, field) {
        if (field.initialPassField) {
            var pwd = Ext.getCmp(field.initialPassField);
            return (val === pwd.getValue());
        }
        return true;
    },
    
    passwordText : translations.PASSWORD_NOT_MATCH   
});

Ext.define('Helpdesk.view.login.SignInForm', {
    extend: 'Ext.form.Panel',  
    alias: 'widget.signinform',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    border: false,
    bodyPadding: 10,
    
    defaults: {
        xtype: 'textfield',
        anchor: '100%',
        labelWidth: 100,
        allowBlank: false,        
        minLength: 3,
        msgTarget: 'under',
        labelStyle: 'font-weight:bold;padding:5px;',
        labelAlign: 'top'
        
    },
    items: [
        {
            xtype: 'hiddenfield',
            fieldLabel: 'Label',
            name: 'id'
        },
        {
            xtype: 'hiddenfield',
            fieldLabel: 'IsEnabled',
            name: 'isEnabled'
        },
        {
            fieldLabel: translations.NAME,
            name: 'name'
        },       
        {
            fieldLabel: translations.EMAIL,
            maxLength: 100,
            name: 'email',
            vtype: 'email',
            minLength: 0
        },
        {
            fieldLabel: translations.PASSWORD,
            name:'password',
            inputType: 'password',
            id: 'pass'
        },
        {
            fieldLabel: translations.PASSWORD_CHECK, 
            name:'password_check',
            inputType: 'password',
            vtype: 'password',
            initialPassField: 'pass', // id of the initial password field
            minLength: 0
        },
        {
            fieldLabel: translations.COMPANY, 
            name:'client'
        }
        
    ],    
    buttons: [
        {
            itemId: 'criarConta',
            formBind: true,
            text: translations.CREATE_ACCOUNT
        },
        {
            itemId: 'voltar',
            text: translations.BACK
        }
    ]
});