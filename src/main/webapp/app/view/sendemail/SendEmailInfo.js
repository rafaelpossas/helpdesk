/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.sendemail.SendEmailInfo', {
    extend: 'Ext.window.Window',
    alias: 'widget.sendemailinfo',
    title: translations.INFORMATION,
    height: 240,
    width: 450,
    modal: true,
    layout: {
        type: 'vbox'
    },
    items: [
        {
            xtype: 'fieldset',
            title: translations.INFORMATION,
            itemId: 'fieldset',
            width: 415,
            margin: '3 0 0 10',
            layout: {
                type: 'vbox'
            },
            defaults: {
                xtype: 'textfield',
                width: 400
            },
            items: [
                {
                    fieldLabel: translations.NAME,
                    id: 'name',
                    readOnly: true
                },
                {
                    fieldLabel: translations.EMAIL,
                    id: 'email',
                    readOnly: true
                },
                {
                    fieldLabel: translations.STATUS,
                    id: 'status',
                    readOnly: true
                },
                {
                    xtype: 'textarea',
                    fieldLabel: translations.MESSAGE,
                    id: 'message',
                    readOnly: true
                }
            ]
        }
    ]
});

