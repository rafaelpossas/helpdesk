Ext.define('Helpdesk.controller.Dashboard', {
    requires: [
        'Helpdesk.store.Users',
        'Helpdesk.store.Tickets',
        'Helpdesk.store.TicketsFromUser',
        'Helpdesk.store.TicketsStatus',
        'Helpdesk.store.Categories',
        'Helpdesk.store.TicketsOngoingClient',
        'Helpdesk.store.TicketsOngoingAgent',
        'Helpdesk.store.DashboardValues'

    ],
    extend: 'Ext.app.Controller',
    stores: [
        'Users',
        'Tickets',
        'TicketsFromUser',
        'TicketsStatus',
        'TicketsByCategory',
        'Categories',
        'TicketsOngoingClient',
        'TicketsOngoingAgent',
        'DashboardValues'
    ],
    views: [
        'dashboard.Dashboard',
        'dashboard.TableTicketInformation',
        'ticket.Ticket'
    ],
    init: function() {
        this.control({
            'tableticket button': {
                click: this.changeView
            }
        });
    },
    refs: [
        {
            ref: 'tableTicket',
            selector: 'dashboard'
        },
        {
            ref: 'ticketSide',
            selector: 'ticket > ticketsidemenu'
        },
        {
            ref: 'ticketPanel',
            selector: 'ticket #ticketgrid'
        }
    ],
    /**
     * 
     * @param {type} form
     * @returns {undefined}
     * Change the view according the selected button on the dashboard
     */
    changeView: function(button) {
        Ext.Router.redirect('ticket');
        this.removeSelection();
        if (button.itemId === 'btnDashboardNoResp') {
            this.getTicketsWithoutResponsible();
        } else if (button.itemId === 'btnDashboardLate') {
            this.getTicketsOpened();
        }
    },
    removeSelection: function() {
        this.getTicketSide().down('button#buttonWithoutResponsible').toggle(false);
        this.getTicketSide().down('button#buttonMyTickets').toggle(false);
        this.getTicketSide().down('button#buttonOpened').toggle(false);
        this.getTicketSide().down('button#buttonClosed').toggle(false);
        this.getTicketSide().down('button#buttonAll').toggle(false);
    },
    getTicketsWithoutResponsible: function() {
        var myscope = this;

        myscope.getTicketPanel().getStore().proxy.url = 'ticket/withoutresponsible-paging';
        myscope.getTicketSide().down('button#buttonWithoutResponsible').toggle(true);
        myscope.getTicketPanel().getStore().load({
            params: {
                user: Helpdesk.Globals.userLogged.userName,
                start: 0,
                limit: Helpdesk.Globals.pageSizeGrid
            },
            callback: function() {                
                myscope.backToDefaultStore(myscope);
                
                //loadStore to toolbar
                var toolbar = myscope.getTicketPanel().getDockedItems()[1];
                toolbar.getStore().proxy.url = 'ticket/withoutresponsible';;
                toolbar.getStore().load({
                    params: {
                        user: Helpdesk.Globals.userLogged.userName
                    },
                    callback: function() {
                        toolbar.getStore().proxy.url = 'ticket';
                    }
                });
            }
        });
    },
    getTicketsOpened: function() {
        var myscope = this;

        myscope.getTicketPanel().getStore().proxy.url = 'ticket/opened-paging';
        myscope.getTicketSide().down('button#buttonOpened').toggle(true);
        myscope.getTicketPanel().getStore().load({
            params: {
                user: Helpdesk.Globals.userLogged.userName,
                start: 0,
                limit: Helpdesk.Globals.pageSizeGrid
            },
            callback: function() {                
                myscope.backToDefaultStore(myscope);
                
                //loadStore to toolbar
                var toolbar = myscope.getTicketPanel().getDockedItems()[1];
                toolbar.getStore().proxy.url = 'ticket/opened';
                toolbar.getStore().load({
                    params: {
                        user: Helpdesk.Globals.userLogged.userName
                    },
                    callback: function() {
                        toolbar.getStore().proxy.url = 'ticket';
                    }
                });
            }
        });
    },
    getAllTickets: function() {
        var myscope = this;

        myscope.getTicketPanel().getStore().proxy.url = 'ticket/all';
        myscope.getTicketPanel().getStore().load({
            params: {
                user: Helpdesk.Globals.userLogged.userName
            },
            callback: function() {
                myscope.getTicketSide().down('button#buttonAll').toggle(true);
                myscope.backToDefaultStore(myscope);
            }
        });
    },
    /**
     * 
     * @param {type} form
     * @returns {undefined}
     * Call the methods that sets the view
     */
    setChartsAndView: function() {
        
        var categoryStore = this.getTicketsByCategoryStore();
        var userStore = this.getTicketsFromUserStore();
        var statusTickets = this.getTicketsStatusStore();
        var clientsStore = this.getTicketsOngoingClientStore();
        var agentStore = this.getTicketsOngoingAgentStore();
        var form = this.getTableTicket().down('tableticket');               
        var store = this.getDashboardValuesStore();
        this.getTableTicket().setLoading(translations.LOADING);
        var scope = this;
        
        //Reseta o conteúdo das stores
        categoryStore.removeAll();
        userStore.removeAll();
        statusTickets.removeAll();
        clientsStore.removeAll();
        agentStore.removeAll();
        store.removeAll();
        
        store.load({
            callback:function(){
                //Seta a store de Tickets x Category                
                for(var i=0;i<store.getCount();i++){
                    if(store.data.items[i].data.type === translations.CATEGORY_TICKET){
                        categoryStore.add(store.data.items[i].data);                        
                    }                    
                    //Seta a store de tickets x users                
                    if(store.data.items[i].data.type === translations.USER_TICKET){
                        userStore.add(store.data.items[i].data);                         
                    }                    
                    //Seta a store de status x tickets                    
                    if(store.data.items[i].data.type === translations.STATUS_TICKET){
                        statusTickets.add(store.data.items[i].data);                        
                    }                    
                    //Seta a store de Agent x tickets                    
                    if(store.data.items[i].data.type === translations.AGENT_TICKET){
                        agentStore.add(store.data.items[i].data);                        
                    }                    
                    //Seta a store de User x tickets                    
                    if(store.data.items[i].data.type === translations.USER_TICKET_OPEN){
                        clientsStore.add(store.data.items[i].data);                        
                    }
                    //Seta a store de tickets sem responsável
                    if(store.data.items[i].data.type === translations.NO_RESPONSIBLE_OPEN){                        
                        form.down('panel#noRespHtml').update(store.data.items[i].data.count);
                    }
                    //Seta a store de tickets em andamento
                    if(store.data.items[i].data.type === translations.OPEN_TICKET_TITLE){                        
                        form.down('panel#noRespLate').update(store.data.items[i].data.count);
                    }
                }
                scope.getTableTicket().setLoading(false,false);
                
            }
        });       
       
    },     
    backToDefaultStore: function(scope) {
        scope.getTicketPanel().getStore().proxy.url = 'ticket';
    }
});
