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
                url: 'ticket'
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
        Ext.Ajax.request({
            method: 'PUT',
            jsonData: Helpdesk.Globals.userLogged,
            url: 'ticket/'+ticket.id+'/close',
            success: callbackfunction,
            failure: function(response){
                var bodyHtml = /<body.*?>([\s\S]*)<\/body>/.exec(response.responseText)[1];
                Helpdesk.Current.fireEvent('servererror', bodyHtml);
            }

        });
    },
    openTicket: function (ticket, username, callbackfunction) {
        Ext.Ajax.request({
            method: 'PUT',
            jsonData: Helpdesk.Globals.userLogged,
            url: 'ticket/'+ticket.id+'/open',
            success: callbackfunction,
            failure: function(response){
                var bodyHtml = /<body.*?>([\s\S]*)<\/body>/.exec(response.responseText)[1];
                Helpdesk.Current.fireEvent('servererror', bodyHtml);
            }
        });
    },
    findAll: function (user, start, limit, callbackfunction) {
        this.load({
            url: 'ticket',
            params: {
                start: start,
                limit: limit
            },
            callback: callbackfunction
        });
    },
    findByResponsible: function(user,start,limit,callbackfunction){
        this.load({
            params: {
                user: user,
                start: start,
                limit: limit
            },
            callback: callbackfunction
        });
    },
    findByStatus: function (start, limit,status,callbackfunction) {
        this.load({
            params: {
                start: start,
                limit: limit,
                status: status
            },
            callback: callbackfunction
        });
    },
    search: function (searchterm, typesearch, start, limit, callbackfunction) {
        this.load({
            params: {
                searchterm: searchterm,
                typesearch: typesearch,
                start: start,
                limit: limit
            },
            callback: callbackfunction
        });
    },
    getTicketCount: function (callbackfunction) {
        Ext.Ajax.request({
            url: 'ticket/count',
            method: 'GET',
            async: false,
            success: callbackfunction
        });
    }
});

