/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.emailconfig.EmailConfig', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.emailconfig',
    layout: {
        type: 'fit'
    },
    requires: ['Helpdesk.view.emailconfig.EmailConfigForm'],
    border: 0,
    items: [
        {
            xtype: 'emailconfigform',
            itemId: 'emailconfigformpanel'
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
                    text: translations.SAVE,
                    disabled: true,
                    itemId: 'saveEmailConfig',
                    iconCls: 'save_16'
                }
            ]
        }
    ]
});

