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
    init: function () {
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
     * Mudar a view para a view de tickets baseado na seleção do usuário na tela de Dashboard.
     * 
     * @author André Sulivam
     * @param {type} button
     * @returns {undefined}
     */
    changeView: function (button) {        
        if (button.itemId === 'btnDashboardNoResp') {
            Ext.Router.redirect('ticket/noresp');
        } else if (button.itemId === 'btnDashboardLate') {
            Ext.Router.redirect('ticket/opened');      
        }
    },
    /**
     * Buscando os valores para preencher os gráficos e relatórios na tela de dashboard.
     * 
     * @author Ricardo
     * @returns {undefined}
     */
    setChartsAndView: function () {

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
            callback: function () {
                //Seta a store de Tickets x Category                
                for (var i = 0; i < store.getCount(); i++) {
                    var data = store.data.items[i].data;
                    if (data.type === translations.CATEGORY_TICKET) {
                        categoryStore.add(data);
                    }
                    //Seta a store de tickets x users                
                    if (data.type === translations.USER_TICKET) {
                        userStore.add(data);
                    }
                    //Seta a store de status x tickets                    
                    if (data.type === translations.STATUS_TICKET) {
                        statusTickets.add(data);
                    }
                    //Seta a store de Agent x tickets                    
                    if (data.type === translations.AGENT_TICKET) {
                        agentStore.add(data);
                    }
                    //Seta a store de User x tickets                    
                    if (data.type === translations.USER_TICKET_OPEN) {
                        clientsStore.add(data);
                    }                    
                    //Seta a store de tickets sem responsável
                    if (data.type === translations.NO_RESPONSIBLE_OPEN) {                          
                        form.down('panel#noRespHtml').update(data.count);                       
                    }
                    //Seta a store de tickets em andamento
                    if (store.data.items[i].data.type === translations.OPEN_TICKET_TITLE) {
                        form.down('panel#noRespLate').update(data.count);
                    }
                }
                scope.getTableTicket().setLoading(false, false);
            }
        });
    }
});
