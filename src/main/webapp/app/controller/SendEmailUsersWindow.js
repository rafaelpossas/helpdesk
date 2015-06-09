/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.controller.SendEmailUsersWindow', {
    extend: 'Ext.app.Controller',
    views: ['sendemail.SendEmailUsersWindow'],
    init: function () {
        this.control({
            'sendemailuserswindow': {
                afterlayout: this.onShowUsersWindow
            },
            'sendemailuserswindow button#cancelSend': {
                click: this.onClickButtonCancel
            },
            'sendemailuserswindow button#close': {
                click: this.onClickButtonClosed
            },
            'sendemailuserswindow button#information': {
                click: this.onClickButtonInfo
            },
            '#usersPanel ': {
                itemclick: this.onSelectUser
            }
        });
    },
    requires: ['Helpdesk.store.SendEmails',
        'Helpdesk.view.sendemail.SendEmailInfo'],
    stores: ['SendEmails'],
    refs: [
        {
            ref: 'usersWindow',
            selector: 'sendemailuserswindow'
        }
    ],
    // atributo para verificar se o botão de cancelar envios foi clicado.
    cancelSend: false,
    // atributo que recebe o usuário selecionado do grid.
    userSelected: '',
    /**
     * Método após a window ter sido criada e chamada pelo método .show().
     * 
     * @author André Sulivam
     * @returns {undefined}
     */
    onShowUsersWindow: function () {
        var window = this.getUsersWindow();
        var subject = window.subject;
        var message = window.message;
        this.cancelSend = false;
        this.onDisableButtons(false, true);
        this.sendEmailSingle(0, subject, message);
    },
    /**
     * Método para envio do email aos usuários.
     * 
     * @author André Sulivam
     * @param {type} position
     * @param {type} subject
     * @param {type} message
     * @returns {undefined}
     */
    sendEmailSingle: function (position, subject, message) {
        var scope = this;
        var store = this.getSendEmailsStore();

        var window = this.getUsersWindow();
        var storepanel = window.down('#usersPanel').getStore();

        // usuários para enviar o email.
        var items = storepanel.data.items;

        var idUser = 0;
        var emailUser = '';

        // teste se o atributo para posição da lista é maior que o tamanho total da lista.
        if (position < items.length) {

            // recupera o email do usuário na posição 'position'
            emailUser = items[position].data.email;

            // recupera o id do usuário na posição 'position'
            idUser = new Number(items[position].data.id);

            // atualiza o status do usuário no grid para Sending.
            this.updateStatusSentEmail(idUser, "SENDING");

            // requisição para envio do email, enviando como parâmetro os atributos callback, subject, message, emailUser, idUser
            store.sendEmailSingle(function (result) {
                var jsonObj = $.parseJSON('[' + result + ']');
                var idUser = jsonObj[0].id;

                // recupera o status do envio
                var status = jsonObj[0].status;

                // recupera a mensagem de retorno do envio
                var messageStatus = jsonObj[0].message;

                // atualiza o status do usuário no grid para o status que retornou do envio                
                scope.updateStatusSentEmail(idUser, status, messageStatus);

                // testa se o botão cancelar foi clicado.
                if (!scope.cancelSend) {
                    // caso não tenha sido, é chamado o método novamente para o próximo usuário da lista.
                    scope.sendEmailSingle((position + 1), subject, message);
                }
            }, subject, message, emailUser, idUser);
        } else {
            // caso tenha finalizado todos os usuários para o envio, atualiza-se os botões de cancelar e fechar.
            this.onDisableButtons(true, false);
        }
    },
    /**
     * Método para atualizar o status de envio do usuário no grid.
     * 
     * @author André Sulivam
     * @param {type} idUser
     * @param {type} status
     * @param {type} message
     * @returns {undefined}
     */
    updateStatusSentEmail: function (idUser, status, message) {
        if (this.getUsersWindow() !== null && this.getUsersWindow() !== undefined) {
            var storepanel = this.getUsersWindow().down('#usersPanel').getStore();
            var items = storepanel.data.items;
            var idTemp = 0;
            for (var i = 0; i < items.length; i++) {
                idTemp = new Number(items[i].data.id);
                if (idTemp.toString() === idUser.toString()) {
                    items[i].data.status = status;
                    items[i].data.message = message;
                }
            }
            // força atualização da store no grid.
            this.getUsersWindow().down('#usersPanel').getView().refresh();
        }
    },
    /**
     * Método quando o usuário clicar no botão cancelar antes do envio do email para todos os usuários. <br>
     * O método altera o status do envio para os usuários que estão como 'A enviar' para 'Cancelado pelo usuário'
     * 
     * @author André Sulivam
     * @param {type} button
     * @param {type} e
     * @param {type} options
     * @returns {undefined}
     */
    onClickButtonCancel: function (button, e, options) {
        this.cancelSend = true;
        var storepanel = this.getUsersWindow().down('#usersPanel').getStore();
        var items = storepanel.data.items;
        for (var i = 0; i < items.length; i++) {
            if (items[i].data.status === "TO_SEND") {
                items[i].data.status = "CANCELED";
                items[i].data.message = translations.CANCELED_BY_USER;
            }
        }
        // força atualização da store no grid.
        this.getUsersWindow().down('#usersPanel').getView().refresh();
        // atualiza-se os botões de cancelar e fechar.
        this.onDisableButtons(true, false);
    },
    onSelectUser: function (grid, record, item, index, e, eOpts) {
        var window = this.getUsersWindow();
        var buttonInfo = window.down('button#information');
        buttonInfo.setDisabled(false);
        this.userSelected = record.data;
    },
    /**
     * Método para atualizar o status dos botões de cancelar e fechar na window.
     * 
     * @author André Sulivam
     * @param {type} disableCancel
     * @param {type} disableClose
     * @returns {undefined}
     */
    onDisableButtons: function (disableCancel, disableClose) {
        var window = this.getUsersWindow();
        var buttonClose = window.down('button#close');
        buttonClose.setDisabled(disableClose);

        var buttonCancel = window.down('button#cancelSend');
        buttonCancel.setDisabled(disableCancel);
    },
    /**
     * Método para fechar a window quando se clicar no botão de fechar.
     * 
     * @author André Sulivam
     * @returns {undefined}
     */
    onClickButtonClosed: function () {
        var window = this.getUsersWindow();
        window.close();
    },
    /**
     * Método para abrir a window com as informações sobre o envio de email para o usuário selecionado no grid.
     * 
     * @author André Sulivam
     * @returns {undefined}
     */
    onClickButtonInfo: function () {
        var window = Ext.create('Helpdesk.view.sendemail.SendEmailInfo');
        var fieldset = window.down('#fieldset');

        var name = fieldset.items.items[0];
        var email = fieldset.items.items[1];
        var status = fieldset.items.items[2];
        var message = fieldset.items.items[3];

        name.setValue(this.userSelected.name);
        email.setValue(this.userSelected.email);
        status.setValue(translations[this.userSelected.status]);
        message.setValue(this.userSelected.message);

        fieldset.doLayout();
        window.show();
    }
});

