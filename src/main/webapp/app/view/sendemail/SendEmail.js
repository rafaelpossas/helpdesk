/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.sendemail.SendEmail', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sendemail',
    layout: {
        type: 'fit'
    },
    requires: ['Helpdesk.view.sendemail.SendEmailForm'],
    border: 0,
    items: [
        {
            xtype: 'sendemailform'
        }
    ],
    dockedItems: [
        {
            xtype: 'toolbar',
            flex: 1,
            dock: 'top',
            items: [
                {
                    xtype: 'tbfill'
                },
                {
                    xtype: 'button',
                    text: translations.CLEAR,
                    itemId: 'clear',
                    iconCls: 'clear_16'
                },
                {
                    xtype: 'button',
                    text: translations.SEND,
                    disabled: true,
                    itemId: 'sendEmails',
                    iconCls: 'send_email_16'
                }
            ]
        }
    ]
});

