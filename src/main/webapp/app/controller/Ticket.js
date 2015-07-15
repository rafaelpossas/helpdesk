/* 
 * @Author rafaelpossas
 * 
 * This controller is responsible for controlling the menu clicks and window
 * changes of all the ticket views. The view is created by selecting the tab button
 * on the main header of the application. The window that is opened has all its items
 * controlled by this class and therefore will dispatch events that will also be 
 * listened by this class.
 * 
 * Views:
 *    view/ticket/MainPanel.js
 *    view/ticket/Ticket.js
 *    view/ticket/TicketSideMenu.js
 *    view/ticket/TicketSideMenuItem.js
 */
Ext.define('Helpdesk.controller.Ticket', {
    extend: 'Ext.app.Controller',
    views: [
        'ticket.Ticket',
        'ticket.NewTicket',
        'ticket.TicketDetails',
        'ticket.TicketAnswerPanel'
    ],
    stores: ['Tickets',
        'TicketAnswers',
        'Clients',
        'UsersAdmin',
        'Reports',
        'ChangesTicket',
        'Attachments'],
    requires: ['Helpdesk.model.Ticket',
        'Helpdesk.store.Tickets',
        'Helpdesk.store.TicketAnswers',
        'Helpdesk.store.Clients',
        'Helpdesk.store.UsersAdmin',
        'Helpdesk.store.Reports',
        'Helpdesk.store.ChangesTicket'],
    init: function () {
        this.control({
            'ticketsidemenu button': {
                click: this.onTicketMenuClick
            },
            '#btnNewTicket': {
                click: this.onCriarTicket
            },
            '#addTicket': {
                click: this.saveNewTicket
            },
            '#addNewClient': {
                click: this.onAddNewClient
            },
            'clientcadastre button#save': {
                click: this.onSaveNewClient
            },
            '#ticketgrid': {
                itemclick: this.ticketClicked
            },
            'button#editTicket': {
                click: this.editTicket
            },
            'ticket combobox#cmbSearch': {
                change: this.changeCmbSearch,
                buffer: 1000
            },
            'ticketgrid pagingtoolbar#dockedItem': {
                beforechange: this.changeGridPage
            },
            'editticket button#btnSaveEditTicket': {
                click: this.onSaveTicketChanges
            },
            'editticket button#btnCancelEditTicket': {
                click: this.cancelEditTicket
            },
            'ticketdetails button': {
                click: this.onClickButtonCloseOrReOpenTicket
            },
            'ticket textfield#searchBox': {
                change: {
                    fn: this.searchFunction,
                    buffer: 1000
                }
            }

        });
    },
    refs: [
        {
            ref: 'cardPanel',
            selector: 'viewport > container#maincardpanel'
        },
        {
            ref: 'mainHeader',
            selector: 'viewport mainheader'
        },
        {
            ref: 'ticketPanel',
            selector: 'ticket #ticketgrid'
        },
        {
            ref: 'ticketCardContainer',
            selector: 'ticket #cardContainer'
        },
        {
            ref: 'ticketSideMenu',
            selector: 'ticket > ticketsidemenu'
        },
        {
            ref: 'ticketEditContainer',
            selector: '#ticketEditContainer'
        },
        {
            ref: 'ticketDetailsView',
            selector: 'ticketdetails'
        },
        {
            ref: 'ticketView',
            selector: 'ticket'
        },
        {
            ref: 'ticketGrid',
            selector: 'ticketgrid'
        },
        {
            ref: 'searchBox',
            selector: 'ticket textfield#searchBox'
        }

    ],
    /**
     * Método quando o usuário clicar em Fechar ou Reabrir o ticket.
     * 
     * @author André Sulivam
     * @param {type} button
     * @returns {undefined}
     */
    onClickButtonCloseOrReOpenTicket: function (button) {
        if (button.id === 'btnCloseTkt' || button.id === 'btnOpenTkt') {
            var scope = this;
            var mainView = this.getTicketView();
            var record = button.up('form#ticketMainView').getRecord();

            var store = this.getTicketsStore();
            if (button.id === 'btnCloseTkt') {
                mainView.setLoading(translations.CLOSING_TICKET);
                //store.proxy.url = 'ticket/close-ticket';
                store.closeTicket(record.data, function (result) {
                    mainView.setLoading(false);
                    scope.setSideMenuButtonText();
                    scope.formatTicketDetailsByStatusTicket(false, button.up('form#ticketMainView'), record);
                });
            } else if (button.id === 'btnOpenTkt') {
                mainView.setLoading(translations.REOPENING_TICKET);
                //store.proxy.url = 'ticket/open-ticket';
                store.openTicket(record.data, function (result) {
                    mainView.setLoading(false);
                    scope.setSideMenuButtonText();
                    scope.formatTicketDetailsByStatusTicket(true, button.up('form#ticketMainView'), record);
                });
            }
        }
    },
    /**
     * Formata a tela de ticketdetails após reabrir ou fechar o ticket.
     * Habilita ou desabilita a tela de inserção de nova resposta e configura labels e botões do ticketdetails.
     * 
     * @author André Sulivam
     * @param {type} ticketOpen
     * @param {type} ticketView
     * @param {type} record
     * @returns {undefined}
     */
    formatTicketDetailsByStatusTicket: function (ticketOpen, ticketView, record) {
        if (ticketOpen === true) {
            ticketView.down('text#tktStatus').setText(translations.TICKET_TITLE_OPENED);
            ticketView.down('label#lblTicketOpen').setVisible(true);
            ticketView.down('button#btnCloseTkt').setVisible(true);
            ticketView.down('label#lblTicketClosed').setVisible(false);
            ticketView.down('button#btnOpenTkt').setVisible(false);
            //Seta visibilidade do botão salvar
            if (Helpdesk.Globals.idAdminGroup == Helpdesk.Globals.userLogged.userGroup.id) {
                ticketView.down('button#editTicket').setVisible(true);
            }
            ticketView.down('button#btnSaveAnswTkt').setVisible(true);
            //Seta visibildade do panel de nova resposta
            ticketView.down('panel#panelElementsNewAnswer').show();
        } else {
            ticketView.down('text#tktStatus').setText(translations.TICKET_TITLE_CLOSED);
            ticketView.down('label#lblTicketOpen').setVisible(false);
            ticketView.down('button#btnCloseTkt').setVisible(false);
            ticketView.down('label#lblTicketClosed').setVisible(true);
            ticketView.down('button#btnOpenTkt').setVisible(true);
            if (Helpdesk.Globals.idAdminGroup == Helpdesk.Globals.userLogged.userGroup.id) {
                ticketView.down('button#editTicket').setVisible(false);
            }
            //Seta visibilidade do botão salvar
            ticketView.down('button#btnSaveAnswTkt').setVisible(false);
            //Seta visibildade do panel de nova resposta
            ticketView.down('panel#panelElementsNewAnswer').hide();
        }
    },
    /**
     * Salva as alterações do ticket
     * @param {type} button
     * @returns {undefined}
     */
    onSaveTicketChanges: function (button) {
        var myScope = this;
        var mainView = this.getTicketView();
        var form = button.up('form#ticketMainView');
        var record = button.up('form#ticketMainView').getRecord();
        mainView.setLoading(translations.SAVING);
        if (form.down('combobox#priorityTicket').getValue() === null || form.down('combobox#priorityTicket').getValue() === '') {
            var priorityIndex = Ext.StoreMgr.lookup(form.down('combobox#priorityTicket').getStore()).findExact('name', translations.NO_PRIORITY);
            var priorityRecord = Ext.StoreMgr.lookup(form.down('combobox#priorityTicket').getStore()).getAt(priorityIndex);
            form.down('combobox#priorityTicket').setValue(priorityRecord);
            record.data.priority = this.getRecordFromComboBox(form.down('combobox#priorityTicket').getStore(), form.down('combobox#priorityTicket').getValue());
        } else {
            record.data.priority = this.getRecordFromComboBox(form.down('combobox#priorityTicket').getStore(), form.down('combobox#priorityTicket').getValue());
        }

        record.data.category = this.getRecordFromComboBox(form.down('combobox#categoryTicket').getStore(), form.down('combobox#categoryTicket').getValue());
        //Se nenhuma categoria tiver sido marcada, o ticket recebe "Sem categoria"
        if (typeof record.data.category === 'undefined') {
            record.data.category = form.down('combobox#categoryTicket').getStore().data.items[4].data;
        }
        record.data.responsible = this.getRecordFromComboBox(form.down('combobox#responsibleTicket').getStore(), form.down('combobox#responsibleTicket').getValue());
        record.data.stepsTicket = form.down('textarea#stepsTicket').getValue();

        var estimateTime = form.down('datefield#estimateTime').getValue();
        //Adiciona um dia a variável pois o mesmo é perdido ao passar para o java
        if (estimateTime !== null) {
            estimateTime.setDate(estimateTime.getDate() + 1);
        }
        record.data.estimateTime = estimateTime;
        record.dirty = true;
        var store = this.getTicketsStore();
        /**
         * @author andresulivam
         */
        if (typeof record.data.priority === 'undefined') {
            record.data.priority = null;
        }
        if (typeof record.data.responsible === 'undefined') {
            record.data.responsible = null;
        }
        //---------------------------------------------------------------------
        store.add(record);
        if (store.getModifiedRecords().length > 0) {
            store.sync({
                callback: function () {
                    myScope.getTicketEditContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_details_view);
                    myScope.setValuesFromView(form.up(), record);
                    mainView.setLoading(false);
                }
            });
        } else {
            mainView.setLoading(false);
            Ext.Msg.alert(translations.INFORMATION, translations.NOTHING_TO_SAVE);
        }
    },
    //Retorna o record selecionado no combobox
    getRecordFromComboBox: function (store, idSelected) {
        if (store !== null && idSelected !== null) {
            for (var i = 0; i < store.getCount(); i++) {
                if (store.data.items[i].data.id === idSelected) {
                    return store.data.items[i].data;
                }
            }
            return null;
        }
    },
    /**
     * Faz a paginação do grid de tickets de acordo com a página selecionada
     * @param {type} toolbar
     * @param {type} page
     * @returns {undefined}
     */
    changeGridPage: function (toolbar, page) {
        var limit = (page) * Helpdesk.Globals.pageSizeGrid;
        var start = limit - Helpdesk.Globals.pageSizeGrid;
        this.getTicketsBySideMenuClick(start, limit, this.callbackChangeGridPage);
    },
    callbackChangeGridPage: function () {
        this.setSideMenuButtonText();
    },
    getTicketsBySideMenuClick: function (start, limit, callbackfunction) {
        var store = this.getTicketPanel().getStore();
        var form = this.getTicketSideMenu();
        var username = Helpdesk.Globals.userLogged.userName;
        if (form.down('button#buttonAll').pressed === true) {
            store.findAll(username, start, limit, callbackfunction);
        } else if (form.down('button#buttonMyTickets').pressed === true) {
            store.findByResponsible(username, start, limit, callbackfunction);
        } else if (form.down('button#buttonWithoutResponsible').pressed === true) {
            store.findByResponsible("null", start, limit, callbackfunction);
        } else if (form.down('button#buttonOpened').pressed === true) {
            store.findByStatus(start, limit,"opened", callbackfunction);
        } else if (form.down('button#buttonClosed').pressed === true) {
            store.findByStatus(start, limit,"closed", callbackfunction);
        } else {
            store.findAll(username, start, limit, callbackfunction);
        }
    },
    getSearchType: function(){
        var form = this.getTicketSideMenu();
        if (form.down('button#buttonAll').pressed === true) {
            return 'all';
        } else if (form.down('button#buttonMyTickets').pressed === true) {
            return 'mytickets';
        } else if (form.down('button#buttonWithoutResponsible').pressed === true) {
            return 'withoutresponsible';
        } else if (form.down('button#buttonOpened').pressed === true) {
            return 'opened';
        } else if (form.down('button#buttonClosed').pressed === true) {
            return 'closed';
        } else {
            return 'all';
        }
    },
    searchFunction: function (field, newValue, oldValue, eOpts) {
        var scope = this;
        var store = scope.getTicketPanel().getStore();
        var grid = scope.getTicketPanel();
        var searchTerm = newValue.trim();
        var typeSearch = this.getSearchType();
        var limit = Helpdesk.Globals.pageSizeGrid;
        grid.setLoading(translations.SEARCHING);
        if (searchTerm != "") {
            store.search(searchTerm, typeSearch, 0, limit, function (response) {
                grid.setLoading(false);
                var ticketsModel = Helpdesk.model.Ticket.getProxy().getReader().readRecords(response[0].raw.content);
                store.loadData(ticketsModel.records);
                var toolbar = grid.dockedItems.items[1];
                var totalRecords = response[0].raw.totalElements;
                toolbar.totalRecords = totalRecords;
                toolbar.refreshPagingToolBar(1, toolbar.totalRecords);
                scope.onTextFieldChange(newValue, store, grid);
            });
        } else {
            this.getTicketsBySideMenuClick(0, limit, function () {
                grid.setLoading(false);
                var toolbar = grid.dockedItems.items[1];
                var totalRecords = scope.getNumberOfTicketsFromMenuClicked();
                toolbar.totalRecords = totalRecords;
                toolbar.refreshPagingToolBar(1, toolbar.totalRecords);
            });
        }
    },
    /**
     * Finds all strings that matches the searched value in each grid cells.
     * @param {type} searchValue
     * @param {type} store
     * @param {type} grid
     * @returns {undefined}
     */
    onTextFieldChange: function (searchValue, store, grid) {

        var tagsRe = /<[^>]*>/gm;
        var tagsProtect = '\x0f';
        var searchRegExp = new RegExp(searchValue, 'g' + (false ? '' : 'i'));
        var count = 0;
        var indexes = [];
        var currentIndex = null;
        store.each(function (record, idx) {

            var td = Ext.fly(grid.view.getNode(idx)).down('td'),
                    cell, matches, cellHTML;

            while (td) {
                cell = td.down('.x-grid-cell-inner');
                matches = cell.dom.innerHTML.match(tagsRe);
                cellHTML = cell.dom.innerHTML.replace(tagsRe, tagsProtect);

                // populate indexes array, set currentIndex, and replace wrap matched string in a span
                cellHTML = cellHTML.replace(searchRegExp, function (m) {
                    count += 1;
                    if (Ext.Array.indexOf(indexes, idx) === -1) {
                        indexes.push(idx);
                    }
                    if (currentIndex === null) {
                        currentIndex = idx;
                    }
                    return '<span class="' + 'x-livesearch-match' + '">' + m + '</span>';
                });
                cell.dom.innerHTML = cellHTML;
                td = td.next();
            }
        });
    },
    index: function (params) {
        this.getCardPanel().getLayout().setActiveItem(Helpdesk.Globals.ticketview);
        this.getTicketCardContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_datagrid);
        this.getMainHeader().down("#ticket").toggle(true);

        var start = 0;
        var limit = Helpdesk.Globals.pageSizeGrid;

        switch (params.type) {
            case 'all':
                this.getTicketSideMenu().down('#buttonAll').toggle(true);
            break;
            case 'opened':
                this.getTicketSideMenu().down('#buttonOpened').toggle(true);
            break;
            case 'closed':
                this.getTicketSideMenu().down('#buttonClosed').toggle(true);
            break;
            case 'my':
                this.getTicketSideMenu().down('#buttonMyTickets').toggle(true);
            break;
            case 'noresp':
                this.getTicketSideMenu().down('#buttonWithoutResponsible').toggle(true);
            break;
        }
        this.getTicketsBySideMenuClick(start,limit,this.callbackLoadStore(this))
    },
    /**
     * Açoes realizadas por cada side button 
     * @param {type} btn
     * @returns {undefined}
     */
    onTicketMenuClick: function (btn) {
        this.getSearchBox().reset();
        this.getTicketCardContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_datagrid);
        if (this.getTicketPanel() !== undefined) {
            if (btn.itemId === 'buttonAll') {
                Ext.Router.redirect("ticket/all");
            }
            else if (btn.itemId === 'buttonOpened') {
                Ext.Router.redirect("ticket/opened");
            }
            else if (btn.itemId === 'buttonClosed') {
                Ext.Router.redirect("ticket/closed");
            }
            else if (btn.itemId === 'buttonMyTickets') {
                Ext.Router.redirect("ticket/my");
            }
            else if (btn.itemId === 'buttonWithoutResponsible') {
                Ext.Router.redirect("ticket/noresp");
            }
        }
    },
    /**
     * Retorna o proxy da store de Ticket para o default
     * @param {type} scope
     * @returns {undefined}
     */
    backToDefaultStore: function (scope) {
        scope.getTicketPanel().getStore().proxy.url = 'ticket';
    },
    callbackLoadStore: function (scope) {
        return function () {
            scope.setSideMenuButtonText();
            var totalRecords = scope.getNumberOfTicketsFromMenuClicked();
            var toolbar = scope.getTicketPanel().getDockedItems()[1];
            toolbar.totalRecords = totalRecords;
            toolbar.refreshPagingToolBar(1, toolbar.totalRecords);
            var btnFirst = toolbar.down('#btnFirst');
            var btnPrev = toolbar.down('#btnPrev');
            var btnNext = toolbar.down('#btnNext');
            var btnLast = toolbar.down('#btnLast');
            var pageItem = toolbar.down('#pageItem');

            btnFirst.addListener('click', scope.onBtnFirstClick);
            btnPrev.addListener('click', scope.onBtnPrevClick);
            btnNext.addListener('click', scope.onBtnNextClick);
            btnLast.addListener('click', scope.onBtnLastClick);
            pageItem.addListener('change', scope.onPageItemChange, scope, {buffer: 400});
        };
    },
    /**
     * Busca e preenche as informações do sidemenu (Quantidade de tickets em cada categoria),
     * e seta visibilidade dos botões de acorodo com o perfil utilizado
     */
    setSideMenuButtonText: function () {
        var myscope = this;
        var store = this.getTicketsStore();
        var username = Helpdesk.Globals.userLogged.userName;
        store.getTicketCount(function (o) {
            var decodedString = Ext.decode(o.responseText);
            var sm = myscope.getTicketSideMenu();
            var buttonAll = sm.down('#buttonAll');
            var buttonOpened = sm.down('#buttonOpened');
            var buttonClosed = sm.down('#buttonClosed');
            var buttonMyTickets = sm.down('#buttonMyTickets');
            var buttonWithoutResponsible = sm.down('#buttonWithoutResponsible');
            buttonAll.setText(translations.ALL + ((decodedString.todos === '0') ? (" ") : (" (" + decodedString.todos + ")")));
            buttonOpened.setText(translations.IN_PROGRESS + ((decodedString.abertos === '0') ? (" ") : (" (" + decodedString.abertos + ")")));
            buttonClosed.setText(translations.CLOSED + ((decodedString.fechados === '0') ? (" ") : (" (" + decodedString.fechados + ")")));
            buttonMyTickets.setText(translations.MY_TICKETS + ((decodedString.mytickets === '0') ? (" ") : (" (" + decodedString.mytickets + ")")));
            buttonWithoutResponsible.setText(translations.WITHOUT_RESPONSIBLE + ((decodedString.withoutresponsible === '0') ? (" ") : (" (" + decodedString.withoutresponsible + ")")));
            if (Helpdesk.Globals.userLogged.userGroup.id == Helpdesk.Globals.idAdminGroup) {//superusuario
                buttonAll.setVisible(true);
                buttonOpened.setVisible(true);
                buttonClosed.setVisible(true);
                buttonMyTickets.setVisible(true);
                buttonWithoutResponsible.setVisible(true);
            }
            else {//outros
                buttonAll.setVisible(true);
                buttonOpened.setVisible(true);
                buttonClosed.setVisible(true);
                buttonMyTickets.setVisible(false);
                buttonWithoutResponsible.setVisible(false);
            }
        });
    },
    /*
     * Quando o botão de novo ticket for clicado, realiza a mudança de view do TicketCardContainer
     */
    onCriarTicket: function () {
        this.getTicketCardContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_new);
        var panel = this.getTicketView().down('#panelnewticket');
        this.resetMultiupload(panel, null);
    },
    saveNewTicket: function (button, e, options) {
        var ticketView = this.getTicketView();
        //upload arquivos, caso seja success, salva o novo ticket
        var multiupload = ticketView.down('multiupload');
        this.submitValues(multiupload);
    },
    /**
     * Editado por @andresulivam
     * @returns {undefined}
     */
    saveTicket: function () {
        var scope = this;
        var ticketView = scope.getTicketView();

        var form = ticketView.down('form');
        var record = form.getRecord();
        var values = form.getValues();

        record.set(values);
        //startDate será atribuido no JAVA
        record.data.startDate = null;
        record.data.endDate = null;
        record.data.user = Helpdesk.Globals.userLogged;
        record.data.isOpen = true;
        record.data.lastInteration = null;
        record.data.userLastInteration = Helpdesk.Globals.userLogged;

        if (Helpdesk.Globals.userLogged.userGroup.id != Helpdesk.Globals.idAdminGroup) {
            record.data.responsible = null;
            record.data.priority = null;
            record.data.estimateTime = null;
            record.data.client = Helpdesk.Globals.userLogged.client;
        } else {
            // categoria
            if (form.down('combobox#categoryTicket').getValue() === null) {
                record.data.category = null;
            }
            // responsável
            if (form.down('combobox#responsibleTicket').getValue() === null) {
                record.data.responsible = null;
            }
            //prioridade
            if (form.down('combobox#priorityCmb').getValue() === null) {
                record.data.priority = null;
            } else {
                var priorityTemp = form.down('combobox#priorityCmb');
                if (priorityTemp.valueModels !== null) {
                    var isModel = priorityTemp.valueModels[0] instanceof Helpdesk.model.Priority;
                    if (!isModel) {
                        record.data.priority = null;
                    }
                } else {
                    record.data.priority = null;
                }
            }
            //prazo estimado
            if (form.down('datefield#estimateTime').getValue() === null) {
                record.data.estimateTime = null;
            } else {
                //Adiciona um dia a mais na variável pois o mesmo é perdido na conversão para o java               
                var dateFormattedTemp = new Date(form.down('datefield#estimateTime').getValue());
                dateFormattedTemp.setDate(dateFormattedTemp.getDate() + 1);
                record.data.estimateTime = dateFormattedTemp;
            }
        }

        //verificando se todos os campos obrigatórios estão preenchidos.
        var check = false;
        //verificando se a categoria selecionada é válida.
        if (form.down('combobox#categoryTicket').getValue() !== null) {
            var categoryTemp = form.down('combobox#categoryTicket');
            if (categoryTemp.valueModels !== null) {
                var isModel = categoryTemp.valueModels[0] instanceof Helpdesk.model.Category;
                if (isModel) {
                    check = true;
                }
            }
        }
        if (check) {
            check = false;
            //verificando se os campos de passos, assunto e descrição são válidos.
            if (form.down('textarea#stepsTicket').value !== '' &&
                    form.down('textfield#subject').value !== '' &&
                    form.down('textarea#description').value !== '') {
                check = true;
            }
            if (check) {
                //testando se o usuário é usuário admin para validar o cliente selecionado.
                if (record.data.user.userGroup.id == Helpdesk.Globals.idAdminGroup) {
                    check = false;
                    //verificando se o cliente selecionado é válido.
                    if (form.down('combobox#clientName').getValue() !== null) {
                        var clientTemp = form.down('combobox#clientName');
                        if (clientTemp.valueModels !== null) {
                            var isModel = clientTemp.valueModels[0] instanceof Helpdesk.model.Client;
                            if (isModel) {
                                check = true;
                            }
                        }
                    }
                }
            }
        }
        if (check) {
            this.getTicketPanel().getStore().add(record);
            if (this.getTicketPanel().getStore().getModifiedRecords().length > 0) {
                this.getTicketPanel().getStore().sync({
                    callback: function (records, operation, success) {
                        form.getForm().reset();
                        scope.getTicketCardContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_datagrid);
                        scope.setSideMenuButtonText();
                        if (Helpdesk.Globals.userLogged.userGroup.id == Helpdesk.Globals.idAdminGroup) {
                            scope.getTicketSideMenu().down('#buttonMyTickets').toggle(true);
                        } else {
                            scope.getTicketSideMenu().down('#buttonOpened').toggle(true);
                        }
                        scope.getTicketsBySideMenuClick(0,Helpdesk.Globals.pageSizeGrid,scope.callbackLoadStore(scope));
                        ticketView.setLoading(false);
                    }
                });
            } else {
                Ext.Msg.alert(translations.INFORMATION, translations.NOTHING_TO_SAVE);
                ticketView.setLoading(false);
            }
        } else {
            ticketView.setLoading(false);
            Ext.Msg.alert(translations.INFORMATION, translations.REQUIRED_ITENS_TICKETS);
        }
    },
    /**
     * Função para criar um novo Client durante o cadastro de Tikcet
     */
    onAddNewClient: function () {
        var editWindow = Ext.create('Helpdesk.view.client.ClientCadastre');
        editWindow.setTitle(translations.NEW_CLIENT);
        var form = editWindow.down('form');
        form.loadRecord(Ext.create('Helpdesk.model.Client'));
        editWindow.show();
    },
    /*
     * Função para salvar o novo Client criado
     */
    onSaveNewClient: function (button) {
        var win = button.up('window');
        var form = win.down('form');
        var record = form.getRecord();
        var values = form.getValues();
        record.set(values);
        this.getClientsStore().add(record);
        if (this.getClientsStore().getModifiedRecords().length > 0) {
            this.getClientsStore().sync({
                callback: function (result) {
                    form.loadRecord(result.operations[0].records[0]);
                }
            });
        } else {
            Ext.Msg.alert(translations.INFORMATION, translations.NOTHING_TO_SAVE);
        }
    },
    /**
     * @author Ricardo
     * 
     * Altera para a view de resposta de ticket
     * @param {type} params
     * @returns {undefined}
     */
    edit: function (params) {
        var store = this.getTicketGrid().getStore();
        var scope = this;        
        store.findById(params.id, function (result) {
            scope.getMainHeader().down("#ticket").toggle(true);
            scope.getCardPanel().getLayout().setActiveItem(Helpdesk.Globals.ticketview);
            scope.getTicketCardContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_details);
            scope.setSideMenuButtonText();
            scope.setValuesFromView(scope.getTicketView(), result[0]);
        });
    },
    ticketClicked: function (grid, record, item, index, e, eOpts) {
        var ticketId = record.data.id;
        Ext.Router.redirect("ticket/" + ticketId + "/edit");
    },
    /**
     * @author Ricardo
     * 
     * Insere os valores na view de cadastro de ticket
     * @param {type} ticketView
     * @param {type} record
     * @returns {undefined}
     */
    setValuesFromView: function (ticketView, record) {
        var scope = this;
        if (ticketView !== null && record !== null) {
            var ticket = record.data;

            ticketView.down('form#ticketMainView').loadRecord(record);

            //text titulo
            ticketView.down('text#tktTitle').setText(translations.TICKET + ' #' + ticket.id + ' - ' + ticket.title);

            //text status
            if (ticket.isOpen) {
                ticketView.down('text#tktStatus').setText(translations.TICKET_TITLE_OPENED);
            } else {
                ticketView.down('text#tktStatus').setText(translations.TICKET_TITLE_CLOSED);
            }

            //text by
            ticketView.down('text#tktBy').setText(ticket.userName);

            //formata data Inicial do ticket
            var dateInicial = new Date(ticket.startDate);
            dateInicial = Ext.Date.format(dateInicial, translations.FORMAT_DATE_TIME);
            ticketView.down('text#tktAt').setText(dateInicial);

            //text categoria
            ticketView.down('text#tktCategory').setText(ticket.categoryName);

            //text prioridade
            ticketView.down('text#tktPriority').setText(ticket.priorityName);

            //text prazo estimado
            if (ticket.estimateTime !== null) {
                var dateTemp;
                if (ticket.estimateTime.toString().indexOf('-') >= 0) {
                    var splitedDate = ticket.estimateTime.split('-');
                    dateTemp = new Date(splitedDate[0], splitedDate[1] - 1, splitedDate[2]);
                } else {
                    dateTemp = new Date(ticket.estimateTime);
                }
                dateTemp = Ext.Date.format(dateTemp, translations.FORMAT_JUST_DATE);
                ticketView.down('text#tktEstimatedTime').setText(dateTemp);
            } else {
                ticketView.down('text#tktEstimatedTime').setText(translations.NO_DEADLINE_DEFINED);
            }

            //text responsável
            if (ticket.responsibleName !== null && ticket.responsibleName !== '') {
                ticketView.down('text#tktResponsible').setText(ticket.responsibleName);
            } else {
                ticketView.down('text#tktResponsible').setText(translations.NO_RESPONSIBLE);
            }

            //text passos para reproduzir o erro            
            ticketView.down('label#tktSteps').text = ticket.stepsTicket;

            //passos pra reproduzir com a formatação original (quebra de linha, etc)
            var steps = '<pre>' + ticket.stepsTicket + '</pre>';
            //ticketView.down('label#tktSteps').update('afusaufhusafhuas fuash ufahosuf huasfhsahouf housafho saohf housaf huosahf osahufhousafhouasfohsahufoh safhuoasohf ohsafhsafhsahofhosafhosahof');

            ticketView.down('label#tktSteps').update(steps);
            //ticketView.down('label#tktSteps').update('<pre>' + steps + '</pre>');

            //Remove todas as respostas do panel            
            ticketView.down('panel#tktAnswers').removeAll(true);

            //Recebe todas as respostas do ticket
            var answerStore = this.getTicketAnswersStore();

            answerStore.proxy.url = 'ticket-answer/find-by-ticket/' + ticket.id;
            answerStore.load({
                callback: function () {
                    scope.formatAnswersPanel(ticketView, ticket, answerStore.data.items);
                    var panel = ticketView.down('panel #panelElementsNewAnswer');
                    scope.resetMultiupload(null, panel);
                }
            });
        }
        //limpa campo de texto de nova mensagem
        ticketView.down('panel#panelElementsNewAnswer').down('textarea#tktNewAnswer').setValue('');
        
        //Seta a visibilidade dos botões de fechar ou abrir tickets de acordo com o ticket corrente
        if (ticket.isOpen === true) {
            ticketView.down('label#lblTicketOpen').setVisible(true);
            ticketView.down('button#btnCloseTkt').setVisible(true);
            ticketView.down('label#lblTicketClosed').setVisible(false);
            ticketView.down('button#btnOpenTkt').setVisible(false);
            //Seta visibilidade do botão salvar
            ticketView.down('button#btnSaveAnswTkt').setVisible(true);
            //Seta a visibilidade do botão de edição do ticket
            if (Helpdesk.Globals.userLogged.userGroup.id === 1) {
                ticketView.down('button#editTicket').show();
            }
            ticketView.down('panel#panelElementsNewAnswer').show();
            // ticketView.down('text#txtNewAnswer').show();
        }
        else {
            ticketView.down('label#lblTicketOpen').setVisible(false);
            ticketView.down('button#btnCloseTkt').setVisible(false);
            ticketView.down('label#lblTicketClosed').setVisible(true);
            ticketView.down('button#btnOpenTkt').setVisible(true);
            //Seta visibilidade do botão salvar
            ticketView.down('button#btnSaveAnswTkt').setVisible(false);
            //Seta a visibilidade do botão de edição do ticket
            ticketView.down('button#editTicket').hide();
            ticketView.down('panel#panelElementsNewAnswer').hide();
        }
    },
    /*
     * Muda CardContainer para a view de Edição do ticket.
     * Seta os valores do ticket na tela de edição
     */
    editTicket: function (button, e, options) {
        var ticketView = this.getTicketEditContainer();
        this.getTicketEditContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_details_edit);

        //set category combobox
        var categoryText = ticketView.down('#tktCategory').text;
        var categoryCombo = ticketView.down('#categoryTicket');
        var categoryStore = categoryCombo.store;
        var categoryIndex = Ext.StoreMgr.lookup(categoryStore).findExact('name', categoryText);
        var categoryRecord = Ext.StoreMgr.lookup(categoryStore).getAt(categoryIndex);
        categoryCombo.setValue(categoryRecord);

        //set responsavel combobox        
        var responsibleText = ticketView.down('#tktResponsible').text;
        var responsibleCombo = ticketView.down('#responsibleTicket');
        var responsibleStore = responsibleCombo.store;
        var resposibleTemp;
        if (responsibleText === '' || responsibleText === translations.NO_RESPONSIBLE) {
            resposibleTemp = new Helpdesk.model.User();
            resposibleTemp.data.name = translations.NO_RESPONSIBLE;
            responsibleCombo.setValue(resposibleTemp);
        } else {
            var responsibleIndex = Ext.StoreMgr.lookup(responsibleStore).findExact('name', responsibleText);
            var responsibleRecord = Ext.StoreMgr.lookup(responsibleStore).getAt(responsibleIndex);
            responsibleCombo.setValue(responsibleRecord);
        }

        //set priority combobox
        var priorityText = ticketView.down('#tktPriority').text;
        var priorityCombo = ticketView.down('#priorityTicket');
        var priorityStore = priorityCombo.store;
        var priorityIndex = Ext.StoreMgr.lookup(priorityStore).findExact('name', priorityText);
        var priorityRecord = Ext.StoreMgr.lookup(priorityStore).getAt(priorityIndex);
        priorityCombo.setValue(priorityRecord);

        //set prazo datefield       
        var estimatedText = ticketView.down('#tktEstimatedTime').text;
        var estimatedDateField = ticketView.down('#estimateTime');
        if (estimatedText !== '' && estimatedText !== translations.NO_DEADLINE_DEFINED) {
            //var estimatedDate = new Date(estimatedText);            
            //estimatedDateField.setValue(estimatedDate);
            estimatedDateField.setValue(estimatedText);
        } else {
            estimatedDateField.setValue(null);
        }

        //set steps textarea
        var stepsText = ticketView.down('#tktSteps').text;
        ticketView.down('#stepsTicket').setValue(stepsText);
    },
    cancelEditTicket: function (button, e, options) {
        this.getTicketEditContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_details_view);
    },
    /**
     * Resetando o campo de multiupload para retirar os arquivos que foram inseridos anteriormente.
     * 
     * @author André Sulivam 
     * @param {type} ticketView
     * @returns {undefined}
     */
    resetMultiupload: function (panelTicketView, panelTicketAnswer) {
        // removendo e adicionando um novo item 'multiupload' para zerar os anexos inseridos anteriormente
        var multiUpload = Ext.create('Helpdesk.util.MultiUpload', {
            padding: '0 0 10 0'
        });
        var panel;
        if(panelTicketView !== null){
            panel = panelTicketView;
        } else if(panelTicketAnswer !== null){
            panel = panelTicketAnswer;
        }
//        var panel = ticketView.down('panel #panelElementsNewAnswer');
        var i = 0;
        var index;
        panel.items.each(function (item) {
            // encontrando o item 'multiupload' e setando o index para a posição certa de inseri-lo novamente
            if (item.xtype === 'multiupload') {
                index = i;
                panel.remove(item);
            }
            i++;
        });
        panel.insert(index, multiUpload);
        panel.doLayout();
    },
    /**
     * Método para inserir no painel de resposta os anexos e mudanças de tickets ocorridas. 
     * 
     * @author André Sulivam
     * @param {type} ticketView
     * @param {type} record
     * @param {type} answersList
     * @returns {undefined}
     */
    formatAnswerWithFilesAndChanges: function (ticketView, record, answersList) {
        if (ticketView !== null && record !== null) {
            var ticket = Ext.ModelManager.create(record, 'Helpdesk.model.Ticket');
            // inserindo os anexos nas respostas.
            answersList = this.getFilesFromTicket(ticket, answersList, ticketView);
        }
    },
    updateLayoutPanel: function (ticket, answersList, ticketView) {
        if (answersList !== null && answersList.length > 0) {
            for (var i = 0; i < answersList.length; i++) {
                ticketView.down('panel#tktAnswers').items.add(answersList[i]);
            }
            ticketView.down('panel#tktAnswers').doLayout();

            //expandindo panel da última resposta inserida.
            var answers = ticketView.down('panel#tktAnswers').items;
            var itemsLength = answers.length;
            if (itemsLength > 0) {
                if (ticket.data.isOpen) {
                    var currentAnswer = answers.items[itemsLength - 1];
                    currentAnswer.expand(true);
                }
                answers.items[itemsLength - 1].el.setStyle('margin', '0 0 10px 0');
            }
            ticketView.down('panel#tktAnswers').doLayout();
        }
    },
    /**
     * Método que insere os anexos do ticket e das respostas nos painéis.
     * O parâmetro 'answersList' são os paineis de respostas já prontos com os ids e faltando os arquivos.
     * Ao final retorna todos os paineis com os arquivos anexados a eles.
     * 
     * @param {type} ticket
     * @param {type} answersList
     * @param {type} ticketView
     * @returns answersList
     */
    getFilesFromTicket: function (ticket, answersList, ticketView) {
        var scope = this;
        var ticketId = ticket.data.id;
        var attachmentsStore = this.getAttachmentsStore();
        attachmentsStore.getFilesFromTicket(ticketId, function (response, opts) {
            if (response !== null && response.length > 0) {
                for (var i = 0; i < answersList.length; i++) {
                    var answer = answersList[i];
                    var idAnswer = answer.down('hiddenfield#idAnswer').text;
                    var idTicket = answer.down('hiddenfield#id').text;
                    var fileContainer = answer.down('container#anexo');
                    for (var j = 0; j < response.length; j++) {
                        var file = response[j];
                        var fileIdTicket = file.raw.fileTicketId;
                        var fileIdAnswer = file.raw.fileTicketAnswerId;
                        var fileName = file.raw.fileName;
                        var fileId = file.raw.fileId;
                        var insertAnexo = false;
                        if (idAnswer === 0) {
                            if (fileIdAnswer === '' && parseInt(fileIdTicket) === parseInt(idTicket)) {
                                insertAnexo = true;
                            }
                        }
                        else {
                            if (parseInt(fileIdAnswer) === parseInt(idAnswer)) {
                                insertAnexo = true;
                            }
                        }
                        if (insertAnexo) {
                            var containerAnexos = answer.down('container#containerAttachments');
                            containerAnexos.setVisible(true);
                            var linkButton = {
                                xtype: 'button',
                                text: fileName,
                                fileId: fileId,
                                cls: 'btn-linkbutton-custom',
                                iconCls: 'clip',
                                listeners: {
                                    click: function (button, e, eOpts) {
                                        scope.downloadFile(button.fileId);
                                    }
                                }
                            };
                            fileContainer.insert(linkButton);
                        }
                    }
                }
            }
            // inserindo mudanças de ticket no panel de resposta.
            scope.getChangesFromTicket(ticket, answersList, ticketView);
        });
        return answersList;
    },
    /**
     * Método que insere as mudanças do ticket nos painéis.
     * O parâmetro 'answersList' são os paineis de respostas já prontos com os ids e faltando as mudanças.
     * Ao final retorna todos os paineis com as mudanças já anexadas a eles.
     * 
     * @param {type} ticket
     * @param {type} answersList
     * @param {type} ticketView
     * @returns answersList
     */
    getChangesFromTicket: function (ticket, answersList, ticketView) {
        var scope = this;
        var ticketId = ticket.data.id;
        var changesTicketStore = this.getChangesTicketStore();
        changesTicketStore.findByTicket(function (result) {
            if (result !== null && result.length > 0) {
                for (var i = 0; i < answersList.length; i++) {
                    var answer = answersList[i];
                    var idAnswer = answer.down('hiddenfield#idAnswer').text;
                    var changesContainer = answer.down('container#change');
                    var insertChange = false;
                    var item;
                    for (var j = 0; j < result.length; j++) {
                        var change = result[j];
                        var ticketAnswer = change.data.ticketAnswer;
                        insertChange = false;
                        // testa se a mudança foi antes de alguma resposta e se está no painel de resposta com a descrição do ticket
                        // ou se a mudança foi na resposta atual.
                        if ((idAnswer === 0 && ticketAnswer === null)
                                || ((idAnswer !== 0 && ticketAnswer !== null) && (parseInt(idAnswer) === (parseInt(ticketAnswer.id))))) {
                            insertChange = true;
                        }
                        if (insertChange) {
                            var containerChanges = answer.down('container#containerChanges');
                            containerChanges.setVisible(true);
                            var text = scope.getTextWithChangesTicket(change);
                            item = {
                                xtype: 'box',
                                html: text,
                                cls: 'box-ticket-changes'
                            };
                            changesContainer.insert(item);
                        }
                    }
                }
            }
            scope.updateLayoutPanel(ticket, answersList, ticketView);
        }, ticketId);
        return answersList;
    },
    getTextWithChangesTicket: function (param) {
        var textResponsible = translations.COMMENT_INTERNAL_BY + " ";
        var responsible = param.data.userName;
        var changeDate = new Date(param.data.dateCreation);
        changeDate = " - " + Ext.Date.format(changeDate, translations.FORMAT_DATE_TIME);
        var text = '';
        if (param !== null) {
            var change = param.data;
            var lengthText = 0;

            // formatando texto com mudança de estado ticket.
            if (change.newStateTicket !== null) {
                if (change.newStateTicket !== null) {
                    if (change.newStateTicket === false) {
                        text += translations.TICKET_CLOSED;
                    } else {
                        text += translations.TICKET_REOPENED;
                    }
                    text += ". ";
                }
            }
            lengthText += text.length;

            // formatando texto de mudança de responsável.
            if (change.newResponsible !== null || change.olderResponsible !== null) {
                text += translations.RESPONSIBLE_CHANGED_FROM;
                if (change.olderResponsible !== null) {
                    text += "\"" + change.olderResponsibleName + "\" ";
                } else {
                    text += "\"" + translations.NO_RESPONSIBLE + "\" ";
                }
                text += translations.FOR;
                if (change.newResponsible !== null) {
                    text += " \"" + change.newResponsibleName + "\"";
                } else {
                    text += " \"" + translations.NO_RESPONSIBLE + "\"";
                }
                text += ". ";
            }
            lengthText += text.length;

            // formatando texto de mudança de categoria
            if (change.newCategory !== null || change.olderCategory !== null) {
                text += translations.CATEGORY_CHANGED_FROM;
                if (change.olderCategory !== null) {
                    text += "\"" + change.olderCategoryName + "\" ";
                } else {
                    text += "\"" + translations.NO_CATEGORY + "\" ";
                }
                text += translations.FOR;
                if (change.newCategory !== null) {
                    text += " \"" + change.newCategoryName + "\"";
                } else {
                    text += " \"" + translations.NO_CATEGORY + "\"";
                }
                text += ". ";
            }
            lengthText += text.length;

            // formatando texto de mudança de prioridade
            if (change.newPriority !== null || change.olderPriority !== null) {
                text += translations.PRIORITY_CHANGED_FROM;
                if (change.olderPriority !== null) {
                    text += "\"" + change.olderPriorityName + "\" ";
                } else {
                    text += "\"" + translations.NO_PRIORITY + "\" ";
                }
                text += translations.FOR;
                if (change.newPriority !== null) {
                    text += " \"" + change.newPriorityName + "\"";
                } else {
                    text += " \"" + translations.NO_PRIORITY + "\"";
                }
                text += ". ";
            }
            lengthText += text.length;

            // formatando texto de mudança de prazo estimado.
            if (change.newEstimatedTime !== null || change.olderEstimatedTime !== null) {
                text += translations.ESTIMATED_TIME_CHANGED_FROM;
                var date;
                if (change.olderEstimatedTime !== null) {

                    var dateSpplited = change.olderEstimatedTime.split('-');
                    date = new Date(dateSpplited[0], dateSpplited[1] - 1, dateSpplited[2]);
                    //date = new Date(change.olderEstimatedTime);                   
                    date = Ext.Date.format(date, translations.FORMAT_JUST_DATE);
                    text += "\"" + date + "\" ";
                } else {
                    text += "\"" + translations.NO_DEADLINE_DEFINED + "\" ";
                }
                text += translations.FOR;
                if (change.newEstimatedTime !== null) {

                    var dateSpplited = change.newEstimatedTime.split('-');
                    date = new Date(dateSpplited[0], dateSpplited[1] - 1, dateSpplited[2]);
                    //date = new Date(change.newEstimatedTime);                    
                    date = Ext.Date.format(date, translations.FORMAT_JUST_DATE);
                    text += " \"" + date + "\"";
                } else {
                    text += " \"" + translations.NO_DEADLINE_DEFINED + "\"";
                }
                text += ". ";
            }
        }
        text += "<br />";
        text += "<pre>" + textResponsible + "<b>" + responsible + "</b>" + changeDate + "</pre>";
        return text;
    },
    getButtonMenuClicked: function () {
        var form = this.getTicketSideMenu();

        if (form.down('button#buttonAll').pressed === true) {
            return form.down('button#buttonAll');
        } else if (form.down('button#buttonMyTickets').pressed === true) {
            return form.down('button#buttonMyTickets');
        } else if (form.down('button#buttonWithoutResponsible').pressed === true) {
            return form.down('button#buttonWithoutResponsible');
        } else if (form.down('button#buttonOpened').pressed === true) {
            return form.down('button#buttonOpened');
        } else if (form.down('button#buttonClosed').pressed === true) {
            return form.down('button#buttonClosed');
        } else {
            return form.down('button#buttonAll');
        }
    },
    getNumberOfTicketsFromMenuClicked: function () {
        var buttonClicked = this.getButtonMenuClicked();
        if (buttonClicked.text.indexOf("(") > -1) {
            return parseInt(buttonClicked.text.split('(')[1].split(')')[0].trim());
        }
        else {
            return 0;
        }
    },
    changePage: function (page) {
        var myscope = this;
        var user = Helpdesk.Globals.userLogged.userName;
        var start = ((page - 1) * Helpdesk.Globals.pageSizeGrid) + 1;
        var limit = ((page) * Helpdesk.Globals.pageSizeGrid);
        this.getTicketsBySideMenuClick(start, limit, function(){
            myscope.setSideMenuButtonText();
        });
    },
    onPageItemChange: function (item, newValue, oldValue, eOpts) {
        var toolbar = item.up();
        var pageItem = toolbar.down('#pageItem');
        var totalPages = Math.ceil(toolbar.totalRecords / Helpdesk.Globals.pageSizeGrid);
        if (newValue > totalPages) {
            if (totalPages > 0) {
                pageItem.setValue(totalPages);
            }
            else {
                pageItem.setValue(1);
            }
        }
        else if (newValue <= 0) {
            pageItem.setValue(1);
        }

        this.changePage(newValue);
        toolbar.refreshPagingToolBar(pageItem.value, toolbar.totalRecords);
    },
    onBtnFirstClick: function (button, e, eOpts) {
        var toolbar = button.up();
        var pageItem = toolbar.down('#pageItem');
        pageItem.setValue(1);
        toolbar.refreshPagingToolBar(pageItem.value, toolbar.totalRecords);

    },
    onBtnPrevClick: function (button, e, eOpts) {
        var toolbar = button.up();
        var pageItem = toolbar.down('#pageItem');
        pageItem.setValue(parseInt(pageItem.value) - 1);
        toolbar.refreshPagingToolBar(pageItem.value, toolbar.totalRecords);

    },
    onBtnNextClick: function (button, e, eOpts) {
        var toolbar = button.up();
        var pageItem = toolbar.down('#pageItem');
        pageItem.setValue(parseInt(pageItem.value) + 1);
        toolbar.refreshPagingToolBar(pageItem.value, toolbar.totalRecords);

    },
    onBtnLastClick: function (button, e, eOpts) {
        var toolbar = button.up();
        var totalPages = Math.ceil(toolbar.totalRecords / Helpdesk.Globals.pageSizeGrid);
        var pageItem = toolbar.down('#pageItem');
        pageItem.setValue(totalPages);
        toolbar.refreshPagingToolBar(pageItem.value, toolbar.totalRecords);

    },
    downloadFile: function (fileId) {
        Ext.core.DomHelper.append(document.body, {
            tag: 'iframe',
            id: 'downloadIframe',
            style: 'display:none;',
            src: 'attachments/' + fileId
        });
    },
    submitValues: function (multiupload) {
        var scope = this;
        var ticketView = scope.getTicketView();
        if (multiupload.filesListArchive.length > 0) {
            var time = new Date().getTime();
            var userLogadoText = Ext.DomHelper.append(Ext.getBody(), '<input type="text" name="username" value="' + Helpdesk.Globals.userLogged.userName + '">');
            //Criação do form para upload de arquivos
            var formId = 'fileupload-form-' + time;
            var formEl = Ext.DomHelper.append(Ext.getBody(), '<form id="' + formId + '" method="POST" action="attachments" enctype="multipart/form-data" class="x-hide-display"></form>');
            formEl.appendChild(userLogadoText);
            Ext.each(multiupload.filesListArchive, function (fileField) {
                formEl.appendChild(fileField);
            });

            var form = $("#" + formId);
            form.ajaxForm({
                beforeSend: function () {

                },
                uploadProgress: function (event, position, total, percentComplete) {
                    ticketView.setLoading(translations.UPLOADING_FILES + percentComplete + '%');
                },
                success: function () {

                },
                complete: function (xhr) {
                    var responseJSON = Ext.decode(xhr.responseText);
                    if (responseJSON.success) {
                        ticketView.setLoading(translations.SAVING_TICKET);
                        scope.saveTicket();
                    }
                    else {
                        ticketView.setLoading(false);
                    }
                }
            });
            form.submit();
            //Clear Fields
            multiupload.filesListArchive.length = 0;
            multiupload.fileslist.length = 0;
            multiupload.doLayout();
        }
        else {
            ticketView.setLoading(translations.SAVING_TICKET);
            scope.saveTicket();
        }
    },
    formatAnswersPanel: function (ticketView, ticket, answers) {
        var answersTotal = new Array();
        var resposta;

        // gerando o primeiro painel que contem a descrição do ticket.
        resposta = this.getPanelAnswer(ticket, null);

        //adicionando o primeiro panel a lista de panels de respostas.        
        answersTotal[0] = resposta;

        for (var i = 0; i < answers.length; i++) {
            var answerTemp = answers[i].data;
            resposta = this.getPanelAnswer(null, answerTemp);
            //adicionado o panel de resposta na última posição da lista.
            answersTotal[answersTotal.length] = resposta;
        }
        this.formatAnswerWithFilesAndChanges(ticketView, ticket, answersTotal);
        return answersTotal;
    },
    /**
     * Retorna o painel de resposta para ser inserido no ticket.<br>
     * Através do parâmetro (ticket ou answer), é formatado o painel com os dados corretos.
     * 
     * @author André Sulivam
     * @param {type} ticket
     * @param {type} answer
     * @returns {ext-debug_L4890.ext-debugAnonym$63.create|ClassManager_L218.ClassManagerAnonym$11.create}
     */
    getPanelAnswer: function (ticket, answer) {
        var nameUser = '';
        var date;
        var description = '';
        var idTicket = 0;
        var idAnswer = 0;
        var htmlImage = '';
        var imageUser;

        if (ticket !== null) {
            imageUser = ticket.user.picture;
            date = new Date(ticket.startDate);
            date = Ext.Date.format(date, translations.FORMAT_DATE_TIME);
            nameUser = ticket.user.name;
            description = ticket.description;
            idTicket = ticket.id;
            idAnswer = 0;
        } else if (answer !== null) {
            imageUser = answer.user.picture;
            date = new Date(answer.dateCreation);
            date = Ext.Date.format(date, translations.FORMAT_DATE_TIME);
            nameUser = answer.user.name;
            description = answer.description;
            idTicket = answer.ticket.id;
            idAnswer = answer.id;
        }

        htmlImage += '<img align="left" ';
        if (imageUser !== null && imageUser !== '') {
            htmlImage += 'src = "' + imageUser + '" class = "image-profile-answer" ';
        } else {
            htmlImage += 'class = "image-default-user"';
        }
        htmlImage += '/>';

        var resposta = Ext.create('Helpdesk.view.ticket.TicketAnswerPanel', {
            title: '<div class="div-title-answer">' + htmlImage + '<p class="text-title-answer" align="left">' + nameUser + '</p><p class="date-title-answer">' + date + '</p></div>'
        });
        resposta.down('label#corpo').html = '<pre class="answer-format">' + description + '</pre>';
        resposta.down('hiddenfield#id').text = idTicket;
        resposta.down('hiddenfield#idAnswer').text = idAnswer;

        return resposta;
    }
});