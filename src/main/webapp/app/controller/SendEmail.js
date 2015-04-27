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
                click: this.onButtonClickSendEmails
            },
            'sendemail button#clear': {
                click: this.onButtonClickClearForm
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
     * Enviar emails.
     * @param {type} button
     * @param {type} e
     * @param {type} options
     * @returns {undefined}
     */
    onButtonClickSendEmails: function (button, e, options) {
        var sendEmail = this.getSendEmail();
        sendEmail.setLoading(translations.SENDING_EMAIL);

        var form = this.getEmailForm();

        var subject = form.down('#subject').value;
        var message = form.down('#htmleditormessage').value;
        var clientsSelected = form.down('clientgridcheckbox').getSelectionModel().getSelection();
        var arrayClient = new Array();

        for (var i = 0; i < clientsSelected.length; i++) {
            arrayClient[i] = new Number(clientsSelected[i].data.id);
        }

        var groupClient = JSON.stringify(arrayClient);

        var store = this.getSendEmailsStore();
        store.sendEmail(this.onBackSendEmails, subject, message, groupClient, this);
    },
    onButtonClickClearForm: function(button, e, options){
        var form = this.getEmailForm();

        form.down('#subject').setValue("");
        form.down('#htmleditormessage').setValue("");
        form.down('clientgridcheckbox').getSelectionModel().deselectAll();
    },
    onBackSendEmails: function (result) {
        var sendEmail = this.getSendEmail();
        sendEmail.setLoading(false);
        if (result === true) {
            Ext.Msg.alert(translations.INFORMATION, translations.EMAIL_SENT_SUCCESS);
        } else {
            Ext.Msg.alert(translations.INFORMATION, translations.EMAIL_SENT_FAILED);
        }
    },
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
        console.log(reader);
    },
    onCheckEnableButtonSend: function () {
        var form = this.getEmailForm();

        var subject = form.down('#subject').value;
        var message = form.down('#htmleditormessage').value;
        var clientsSelected = form.down('clientgridcheckbox').getSelectionModel().getSelection();

        var disableButton = (subject === "" || message === "" || clientsSelected.length === 0);
        this.disableButtonSave(disableButton);
    },
    /**
     * Método para habilitar ou desabilitar o botão de Enviar o email baseado no parâmetro enviado.
     * @author André Sulivam
     * @param {type} disableButton
     * @returns {undefined}
     */
    disableButtonSave: function (disableButton) {
        var sendEmail = this.getSendEmail();
        var button = sendEmail.down('button#sendEmails');
        button.setDisabled(disableButton);
    }
});

