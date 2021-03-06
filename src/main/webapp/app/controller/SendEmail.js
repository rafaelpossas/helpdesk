/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.controller.SendEmail', {
    extend: 'Ext.app.Controller',
    views: ['sendemail.SendEmail',
        'sendemail.SendEmailForm'],
    init: function () {
        this.control({
            'sendemail button#sendEmails': {
                click: this.onClickButtonSendEmails
            },
            'sendemail button#clear': {
                click: this.onClickButtonClearForm
            },
            'sendemailform filefield#insertImage': {
                change: this.onButtonInsertImageClick
            },
            'sendemailform textfield#subject': {
                change: this.onCheckEnableButtonSend
            },
            'sendemailform htmleditor#htmleditormessage': {
                change: this.onCheckEnableButtonSend
            },
            'sendemailform clientgridcheckbox': {
                selectionchange: this.onCheckEnableButtonSend
            }
        });
    },
    requires: ['Helpdesk.store.SendEmails'],
    stores: ['SendEmails'],
    refs: [
        {
            ref: 'sendEmail',
            selector: 'sendemail'
        },
        {
            ref: 'emailForm',
            selector: 'sendemailform'
        }
    ],
    /**
     * Método quando o usuário clicar no botão enviar os emails. <br>
     * Cria uma requisição ao servidor que retorne todos os usuários dos clientes selecionados.
     * 
     * @author André Sulivam
     * @param {type} button
     * @param {type} e
     * @param {type} option
     * @returns {undefined}
     */
    onClickButtonSendEmails: function (button, e, option) {
        var store = this.getSendEmailsStore();
        var groupClient = this.getJsonClientsSelected();
        store.getJsonEmailUsers(this.onBackGetJsonEmailUsers, groupClient, this);
    },
    /**
     * Método que cria um array com os objetos selecionados no grid de clientes.
     * 
     * @author André Sulivam
     * @returns {String}
     */
    getJsonClientsSelected: function () {
        var form = this.getEmailForm();
        var clientsSelected = form.down('clientgridcheckbox').getSelectionModel().getSelection();
        var arrayCliente = [];
        for (var i = 0; i < clientsSelected.length; i++) {            
            var cliente = {
                id: clientsSelected[i].data.id,
                name: clientsSelected[i].data.name
            };
            arrayCliente.push(cliente);
        }
        return arrayCliente;
    },
    /**
     * Callback da requisição dos usuários dos clientes selecionados.
     * 
     * @author André Sulivam
     * @param {type} result
     * @returns {undefined}
     */
    onBackGetJsonEmailUsers: function (result) {
        if (result !== null) {
            var jsonObj = $.parseJSON('[' + result + ']');
            this.createWindowWithUsersEmail(jsonObj);
        }
    },
    /**
     * Método que cria a Window que receberá o JSON dos usuários dos clientes selecionados. <br>
     * 
     * @author André Sulivam
     * @param {type} jsonObj
     * @returns {undefined}
     */
    createWindowWithUsersEmail: function (jsonObj) {
        var store = new Ext.data.ArrayStore({
            extend: 'Helpdesk.store.BasicStore',
            id: 0,
            fields: ['id', 'name', 'client', 'email', 'status', 'message'],
            data: jsonObj
        });
        Ext.define('DynamicModel', {
            extend: 'Ext.data.Model',
            fields: ['id', 'name', 'client', 'email', 'status', 'message']
        });
        store.loadData([], false);
        for (var i = 0; i < jsonObj.length; i++) {
            var record = Ext.ModelManager.create(jsonObj[i], 'DynamicModel');
            store.add(record);
        }

        var form = this.getEmailForm();
        var subject = form.down('#subject').value;
        var message = form.down('#htmleditormessage').value;

        var window = Ext.create('Helpdesk.view.sendemail.SendEmailUsersWindow');

        // atualizando store do grid dentro da windows.        
        var panel = window.items.items[0];
        panel.bindStore(store);

        window.subject = subject;
        window.message = message;
        window.show();
    },
    /**
     * Método para limpar todos os campos do formulário de envio de email.
     * 
     * @author André Sulivam
     * @param {type} button
     * @param {type} e
     * @param {type} options
     * @returns {undefined}
     */
    onClickButtonClearForm: function (button, e, options) {
        var form = this.getEmailForm();
        form.down('#subject').setValue("");
        form.down('#htmleditormessage').setValue("");
        form.down('clientgridcheckbox').getSelectionModel().deselectAll();
    },
    /**
     * Inserir imagem no texto. (Não finalizada)
     * 
     * @author André Sulivam
     * @returns {undefined}
     */
    onButtonInsertImageClick: function () {
        var fileField = this.getEmailForm().down('#insertImage');
        var form = this.getEmailForm();
        var message = form.down('#htmleditormessage');

        var fileSelected = fileField.getEl().down('input[type=file]').dom.files[0];
        //console.log(fileSelected.readAsArrayBuffer() );
        // create reader
        var reader = new FileReader();
        // create handler
        reader.onload = (function (theFile) {
            return function (e) {
                // process file
                var tagImg = "<img src=\"data:image/jpg;base64," + e.target.result + "\"/>";
                message.text = tagImg;
            };
        })(fileSelected);
        // start upload
        reader.readAsBinaryString(fileSelected);
    },
    /**
     * Verifica a cada alteração no formulário se todos os campos obrigatórios foram preenchidos e
     * habilita o botão de enviar email caso estejam preenchidos.
     * 
     * @author André Sulivam
     * @returns {undefined}
     */
    onCheckEnableButtonSend: function () {
        var form = this.getEmailForm();

        var subject = form.down('#subject').value;
        var message = form.down('#htmleditormessage').value;
        var clientsSelected = form.down('clientgridcheckbox').getSelectionModel().getSelection();

        var disableButton = (
                (subject === "" || subject === undefined) || 
                (message === "" || message === undefined) || 
                (clientsSelected.length === 0)
                );
        this.disableButtonSend(disableButton);
    },
    /**
     * Método para habilitar ou desabilitar o botão de Enviar o email baseado no parâmetro enviado.
     * @author André Sulivam
     * @param {type} disableButton
     * @returns {undefined}
     */
    disableButtonSend: function (disableButton) {
        var sendEmail = this.getSendEmail();
        var button = sendEmail.down('button#sendEmails');
        button.setDisabled(disableButton);
    }
});

