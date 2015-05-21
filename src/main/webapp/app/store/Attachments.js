/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.store.Attachments', {
    extend: 'Helpdesk.store.BasicStore',
    requires: ['Helpdesk.model.Attachments'],
    model: 'Helpdesk.model.Attachments',
    storeId: 'attachments',
    autoLoad: false,
    constructor: function (config) {
        // applyIf means only copy if it doesn't exist
        Ext.applyIf(config, {
            proxy: Ext.create('Helpdesk.proxy.Base', {
                url: 'attachments'
            })
        });
        this.callParent([config]);
    },
    getFilesFromTicket: function (ticketId, callbackfunction) {
        Ext.Ajax.request({
            url: 'attachments/' + ticketId + '/attachments',
            method: 'GET',
            success: callbackfunction
        });
    }
});

