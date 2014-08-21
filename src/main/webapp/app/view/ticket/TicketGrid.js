Ext.define('Helpdesk.view.ticket.TicketGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.ticketgrid',
    store: 'Tickets',
    requires: ['Helpdesk.store.Tickets'],
    border: 0,
    cls: 'grid-style-header',
    scope: this,
    constructor: function(config) {
        this.param = config.param; // get your param value from the config object
        config.store = Ext.create('Helpdesk.store.Tickets', {
            pageSize: Helpdesk.Globals.pageSizeGrid,
            reader: {
                root: 'items',
                totalProperty: 'total'
            }
        });
        this.callParent(arguments);
    },
    viewConfig: {
        stripeRows: false
    },
    columns: {
        items: [
            {
                header: translations.ID,
                width: 80,
                dataIndex: 'id',
                flex: 0,
                renderer: function(value, metaData, record) { // #2
                    var isBold = this.testIsBold(record);
                    if (isBold) {
                        return '<b>' + value + '</b>';
                    } else {
                        return value;
                    }
                }
            }, {
                header: translations.CLIENT,
                flex: 1,
                dataIndex: 'clientName',
                renderer: function(value, metaData, record) { // #2
                    var isBold = this.testIsBold(record);
                    if (isBold) {
                        return '<b>' + value + '</b>';
                    } else {
                        return value;
                    }
                }
            }, {
                header: translations.USER,
                flex: 1,
                width: 170,
                dataIndex: 'userName',
                renderer: function(value, metaData, record) { // #2
                    var isBold = this.testIsBold(record);
                    if (isBold) {
                        return '<b>' + value + '</b>';
                    } else {
                        return value;
                    }
                }
            }, {
                header: translations.TITLE,
                flex: 2,
                dataIndex: 'title',
                renderer: function(value, metaData, record) { // #2
                    var isBold = this.testIsBold(record);
                    if (isBold) {
                        return '<b>' + value + '</b>';
                    } else {
                        return value;
                    }
                }
            }, {
                header: translations.CATEGORY,
                width: 170,
                flex: 0,
                dataIndex: 'categoryName',
                renderer: function(value, metaData, record) { // #2
                    var isBold = this.testIsBold(record);
                    if (isBold) {
                        return '<b>' + value + '</b>';
                    } else {
                        return value;
                    }
                }
            }, {
                header: translations.SITUATION,
                width: 140,
                flex: 0,
                dataIndex: 'isOpen',
                renderer: function(value, metaData, record) { // #2
                    var isBold = this.testIsBold(record);
                    var state = this.testStateTicket(record);
                    if (isBold) {
                        return '<span class="state-ticket-grid"><b>'+state+'</b></span>';
                    } else {
                        return state;
                    }
                }
            }, {
                header: translations.LAST_INTERATION,
                width: 170,
                flex: 0,
                dataIndex: 'lastInteration',
                renderer: function(value, metaData, record) { // #2
                    var lastInteration = new Date(value);
                    lastInteration = Ext.Date.format(lastInteration, translations.FORMAT_JUST_DATE);
                    var isBold = this.testIsBold(record);
                    if (isBold) {
                        return '<b>'+lastInteration+'</b>';
                    } else {
                        return lastInteration;
                    }
                }
            }, {
                header: translations.RESPONSIBLE,
                width: 170,
                flex: 0,
                dataIndex: 'responsibleName',
                renderer: function(value, metaData, record) { // #2
                    if (value !== null) {
                        var isBold = this.testIsBold(record);
                        if (isBold) {
                            return '<b>' + value + '</b>';
                        } else {
                            return value;
                        }
                    }
                    return '';
                }
            }
        ],
        defaults: {
            tdCls: 'grid-style-row'
        }
    },
    dockedItems: [{
            xtype: 'pagingtoolbar',
            itemId: 'dockedItem',
            store: 'Tickets',
            dock: 'bottom',
            displayInfo: true,
            margin: '0 0 30 0',
            listeners: {
                afterrender: function() {
                    this.child('#refresh').hide();
                }
            }

        }],
    // teste para verificar se o ticket no grid precisa ficar em negrito.
    testIsBold: function(record){
        /*var userLastInteration = record.get('userLastInteration');
        var userLogged = Helpdesk.Globals.userLogged;
        var isOpen = record.get('isOpen');        
        var idUserLast = parseInt(userLastInteration.id);
        var idUserLogged = parseInt(userLogged.id);
        
        var idUserGroupUserLast = parseInt(userLastInteration.userGroup.id);
        var idUserGroupUserLogged = parseInt(userLogged.userGroup.id);

        // testa se o ticket está aberto.
        if(isOpen){
            // testa se o id de quem está logado é diferente do id do usuário da última interação.
            if(idUserLast!==idUserLogged){
                // testa se o usuário logado é administrador.
                if(idUserGroupUserLogged === parseInt(Helpdesk.Globals.idAdminGroup)){
                    // testa se o usuário da última interação também é um administrador.
                    if(idUserGroupUserLast !== parseInt(Helpdesk.Globals.idAdminGroup)){
                        return true;
                    }                
                } else {
                    // testa se os ids do usuário logado e do usuário da última interação são diferentes.
                    if(idUserLast !== idUserLogged){
                        return true;
                    }
                }
            }            
        }*/            
        return false;
    },
    testStateTicket: function(record){
        var userLastInteration = record.get('userLastInteration');
        var userLogged = Helpdesk.Globals.userLogged;
        var isOpen = record.get('isOpen');        
        var idUserLast = parseInt(userLastInteration.id);
        var idUserLogged = parseInt(userLogged.id);
        
        var idUserGroupUserLast = parseInt(userLastInteration.userGroup.id);
        var idUserGroupUserLogged = parseInt(userLogged.userGroup.id);

        // testa se o ticket está aberto.
        if(isOpen){
            if(idUserGroupUserLogged !== parseInt(Helpdesk.Globals.idAdminGroup)){
                return translations.OPENED;
            } else {
                if(idUserGroupUserLast === parseInt(Helpdesk.Globals.idAdminGroup)){
                    return translations.ANSWERED;
                } else if(idUserLast !== idUserLogged){
                    return translations.WAITING;
                } else {
                    return translations.ANSWERED;
                }
            }                   
        }            
        return translations.CLOSED;
    }
});

