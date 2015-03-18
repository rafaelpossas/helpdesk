/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.store.EmailConfigs', {
    extend: 'Helpdesk.store.BasicStore',
    requires: ['Helpdesk.model.EmailConfig'],
    model: 'Helpdesk.model.EmailConfig',
    storeId: 'emailconfigs',
    autoLoad: false,
    constructor: function (config) {
        // applyIf means only copy if it doesn't exist
        Ext.applyIf(config, {
            proxy: Ext.create('Helpdesk.proxy.Base', {
                url: 'emailconfig'
            })
        });
        this.callParent([config]);
    },
    findById: function (callbackfunction, id) {
        this.load({
            url: 'emailconfig/' + id,
            callback: callbackfunction
        });
    }
});

