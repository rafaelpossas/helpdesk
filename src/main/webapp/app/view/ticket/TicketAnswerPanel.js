/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.ticket.TicketAnswerPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.ticketanswerpanel',
    collapsible: true,
    collapsed: true,
    hideCollapseTool: true,
    floatable: false,
    cls: 'panel-answer',
    listeners: {
        afterrender: function(panel) {
            panel.header.el.on('click', function() {
                if (panel.collapsed)
                {
                    panel.expand();
                    panel.el.setStyle('margin', '0 0 10px 0');
                }
                else {
                    panel.collapse();
                    panel.el.setStyle('margin', '0 0 10px 0');
                }
            });
        },
        collapse: function() {
            this.doLayout();
        },
        expand: function() {
            this.doLayout();
        }
    },
    items: [
        {
            xtype: 'hiddenfield',
            itemId: 'id'
        },
        {
            xtype: 'hiddenfield',
            itemId: 'idAnswer'
        },
        {
            xtype: 'label',
            itemId: 'corpo'
        },
        {
            layout: 'hbox',
            border: 0,
            hidden: true,
            itemId: 'containerAttachments',
            margin: '0 0 0 -30',
            items: [
                {
                    xtype: 'label',
                    text: translations.ATTACHMENTS,
                    margin: '10 5 0 0'
                },
                {
                    xtype: 'container',
                    itemId: 'anexo',
                    default: {
                        class: 'shadow'
                    },
                    margin: '10 0 0 0',
                    layout: {
                        type: 'vbox'
                    }
                }
            ]
        },
        {
            layout: 'hbox',
            border: 0,
            itemId: 'containerChanges',
            hidden: true,
            margin: '0 0 0 -30',
            items: [
                {
                    xtype: 'container',
                    itemId: 'change',
                    margin: '10 0 0 0',
                    layout: {
                        type: 'vbox'
                    }
                }
            ]
        }
    ]
});

