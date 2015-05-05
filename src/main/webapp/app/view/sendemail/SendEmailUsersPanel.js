/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.sendemail.SendEmailUsersPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.sendemailuserspanel',
    border: 0,
    cls: 'grid-style-header',
    viewConfig: {
        stripeRows: false
    },
    columns: {
        items: [
            {
                width: 200,
                dataIndex: 'name',
                flex: 1,
                text: translations.NAME
            },
            {
                width: 250,
                dataIndex: 'client',
                flex: 1,
                text: translations.CLIENT
            },
            {
                width: 250,
                dataIndex: 'email',
                flex: 1,
                text: translations.EMAIL
            },
            {
                width: 200,
                dataIndex: 'status',
                flex: 1,
                text: translations.STATUS,
                renderer: function (value, metaData, record) {
                    if (value === "TO_SEND") {
                        return '<b><font color="purple">' + translations.TO_SEND + '</font><b>'
                    } else if (value === "SENDING") {
                        return '<b><font color="blue">' + translations.SENDING_EMAIL + '</font><b>'
                    } else if (value === "SENT") {
                        return '<b><font color="green">' + translations.SENT + '</font><b>'
                    } else if (value === "ERROR") {
                        return '<b><font color="red">' + translations.NOT_SENT + '</font><b>'
                    } else if (value === "CANCELED") {
                        return '<b><font color="black">' + translations.CANCELED_BY_USER + '</font><b>'
                    }
                }
            }
        ],
        defaults: {
            tdCls: 'grid-style-row'
        }
    }

});

