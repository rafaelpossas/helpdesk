Ext.define('Helpdesk.store.TicketsStatus', {
    extend: 'Ext.data.Store',
    model: 'Helpdesk.model.DashboardValue',    
    requires: [
        'Helpdesk.model.DashboardValue'
    ],
    autoLoad: false,
    constructor: function(config) {
        // applyIf means only copy if it doesn't exist
        Ext.applyIf(config, {
            proxy: Ext.create('Helpdesk.proxy.Base', {
                url: 'ticketsstatus'
            })
        });
        this.callParent([config]);
    },    
});

