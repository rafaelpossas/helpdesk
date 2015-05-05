/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.sendemail.SendEmailUsersWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.sendemailuserswindow',
    title: translations.SEND_EMAIL,
    height: 600,
    width: 1000,
    modal: true,
    layout: 'fit',
    closable: false,
    requires: 'Helpdesk.view.sendemail.SendEmailUsersPanel',
    items: [
        {
            xtype: 'sendemailuserspanel',
            id: 'usersPanel'
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
                    itemId: 'information',
                    text: translations.INFO,
                    disabled: true,
                    iconCls: 'info_16'
                },
                {
                    xtype: 'button',
                    text: translations.CANCEL,
                    itemId: 'cancelSend',
                    iconCls: 'cancel_16'
                },
                {
                    xtype: 'button',
                    text: translations.CLOSE,
                    itemId: 'close',
                    iconCls: 'close_16'
                }
            ]
        }
    ],
    subject: '',
    message: ''
});

