/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.store.Tickets', {
    extend: 'Helpdesk.store.BasicStore',
    requires: ['Helpdesk.model.Ticket'],
    model: 'Helpdesk.model.Ticket',
    storeId: 'tickets',
    autoLoad: false,
    pageSize: Helpdesk.Globals.pageSizeGrid,
    constructor: function (config) {
        // applyIf means only copy if it doesn't exist
        Ext.applyIf(config, {
            proxy: Ext.create('Helpdesk.proxy.Base', {
                url: 'ticket',
                extraParams: {
                    user: Helpdesk.Globals.userLogged.userName
                }
            })
        });
        this.callParent([config]);
    },
    findById: function (id, callbackFunction) {
        this.load({
            url: 'ticket/' + id,
            callback: callbackFunction
        });
    },
    onCreateRecords: function (records, operation, success) {
        if (success) {
            Ext.Msg.alert(translations.INFORMATION, translations.TICKET + ' ' + translations.SAVED_WITH_SUCCESS);
        }
    },
    onUpdateRecords: function (records, operation, success) {
        if (success) {
            Ext.Msg.alert(translations.INFORMATION, translations.TICKET + ' ' + translations.UPDATED_WITH_SUCCESS);
        }
    },
    onDestroyRecords: function (records, operation, success) {
        if (success) {
            Ext.Msg.alert(translations.INFORMATION, translations.TICKET + ' ' + translations.DELETED_WITH_SUCCESS);
            this.callParent(arguments);
        }
    },
    closeTicket: function (ticket, callbackfunction) {
        console.log(ticket);
        $.ajax({
            type: 'POST',
            data: {
                ticket: ticket.data
            },
            url: 'ticket/close-ticket',
            success: Ext.bind(callbackfunction)
        });
    },
    openTicket: function (ticket, username, callbackfunction) {
        $.ajax({
            type: 'POST',
            data: {
                ticket: ticket,
                user: username
            },
            url: 'ticket/open-ticket',
            success: Ext.bind(callbackfunction)
        });
    },
    findAllTicketsPaging: function (user, start, limit, callbackfunction) {
        this.load({
            url: 'ticket/all-paging',
            params: {
                user: user,
                start: start,
                limit: limit
            },
            callback: callbackfunction
        });
    },
    findMyTicketsPaging: function (user, start, limit, callbackfunction) {
        this.load({
            url: 'ticket/mytickets-paging',
            params: {
                user: user,
                start: start,
                limit: limit
            },
            callback: callbackfunction
        });
    },
    findWithoutResponsibleTicketsPaging: function (user, start, limit, callbackfunction) {
        this.load({
            url: 'ticket/withoutresponsible-paging',
            params: {
                user: user,
                start: start,
                limit: limit
            },
            callback: callbackfunction
        });
    },
    findOpenedTicketsPaging: function (user, start, limit, callbackfunction) {
        this.load({
            url: 'ticket/opened-paging',
            params: {
                user: user,
                start: start,
                limit: limit
            },
            callback: callbackfunction
        });
    },
    findClosedTicketsPaging: function (user, start, limit, callbackfunction) {
        this.load({
            url: 'ticket/closed-paging',
            params: {
                user: user,
                start: start,
                limit: limit
            },
            callback: callbackfunction
        });
    },
    search: function (searchterm, typesearch, start, limit, callbackfunction) {
        this.load({
            url: 'ticket/search',
            params: {
                searchterm: searchterm,
                typesearch: typesearch,
                start: start,
                limit: limit
            },
            callback: callbackfunction
        });
    },
    setSideMenuButtonText: function (user, callbackfunction) {
        Ext.Ajax.request({
            url: 'ticket/textmenu',
            method: 'GET',
            async: false,
            params: {
                user: user
            },
            success: callbackfunction
        });
    }
});

