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
                    if (data.type === Helpdesk.Globals.category_ticket) {
                        categoryStore.add(data);
                    }
                    //Seta a store de tickets x users                
                    if (data.type === Helpdesk.Globals.user_ticket) {
                        userStore.add(data);
                    }
                    //Seta a store de status x tickets                    
                    if (data.type === Helpdesk.Globals.status_ticket) {
                        statusTickets.add(data);
                    }
                    //Seta a store de Agent x tickets                    
                    if (data.type === Helpdesk.Globals.agent_ticket) {
                        agentStore.add(data);
                    }
                    //Seta a store de User x tickets                    
                    if (data.type === Helpdesk.Globals.user_ticket_open) {
                        clientsStore.add(data);
                    }
                    //Seta a store de tickets sem responsável
                    if (data.type === Helpdesk.Globals.no_responsible_open) {
                        form.down('panel#noRespHtml').update(data.count);
                    }
                    //Seta a store de tickets em andamento
                    if (store.data.items[i].data.type === Helpdesk.Globals.open_ticket) {
                        form.down('panel#noRespLate').update(data.count);
                    }
                }
                scope.getTableTicket().setLoading(false, false);
            }
        });
    }
});
