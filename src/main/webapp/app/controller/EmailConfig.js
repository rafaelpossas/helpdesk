/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.controller.EmailConfig', {
    extend: 'Ext.app.Controller',
    stores: ['EmailConfigs'],
    views: ['emailconfig.EmailConfig', 'emailconfig.EmailConfigForm'],
    init: function () {
        this.control({
            'emailconfig button#saveEmailConfig': {
                click: this.onButtonClickSave
            },
            'emailconfigform': {
                afterlayout: this.onGetEmailConfig
            },
            'emailconfigform textfield#smtpHost': {
                change: this.onCheckEnableButtonSave
            },
            'emailconfigform textfield#imap': {
                change: this.onCheckEnableButtonSave
            },
            'emailconfigform textfield#userEmail': {
                change: this.onCheckEnableButtonSave
            },
            'emailconfigform textfield#password': {
                change: this.onCheckEnableButtonSave
            }
        });
    },
    refs: [
        {
            ref: 'emailConfig',
            selector: 'emailconfig'
        }
    ],
    /**
     * Método que é chamado quando a tela do form é aberta. </br>
     * Ela executa o find da configuração de email salva no banco.
     * @author André Sulivam
     * @returns {undefined}
     */
    onGetEmailConfig: function () {
        var emailConfig = this.getEmailConfig();
        var storeEmailConfig = this.getEmailConfigsStore();
        var scope = this;
        emailConfig.setLoading(translations.LOADING);
        storeEmailConfig.findById(function (result) {
            var model = Ext.ModelManager.create(result[0].data, 'Helpdesk.model.EmailConfig');
            scope.onFillFormEmailConfig(model);
        }, 1);
    },
    /**
     * Método para quando se clicar no botão salvar as configurações de email.
     * 
     * @author André Sulivam
     * @param {type} button
     * @param {type} e
     * @param {type} options
     * @returns {undefined}
     */
    onButtonClickSave: function (button, e, options) {
        var emailConfig = this.getEmailConfig();
        var form = emailConfig.down('#emailconfigformpanel');
        var record = form.getRecord();
        var values = form.getValues();
        var store = this.getEmailConfigsStore();
        record.set(values);
        store.add(record);

        emailConfig.setLoading(translations.LOADING);
        store.sync({
            callback: function (records, operation, success) {
                Ext.Msg.alert(translations.INFORMATION, translations.SAVED_WITH_SUCCESS);
                emailConfig.setLoading(false);
            }
        });
    },
    /**
     * Método para habilitar ou desabilitar o botão Salvar das configurações de email. <br>
     * O teste é baseado nos campos a serem preenchidos. Se houver algum texto vazio, o botão é desabilitado.
     * 
     * @author André Sulivam
     * @returns {undefined}
     */
    onCheckEnableButtonSave: function () {
        var emailConfig = this.getEmailConfig();
        var formPrincipal = emailConfig.down('#emailconfigformpanel');

        var smtpText = formPrincipal.down().down('#smtpHost').value;
        var imap = formPrincipal.down().down('#imap').value;
        var userEmail = formPrincipal.down().down('#userEmail').value;
        var password = formPrincipal.down().down('#password').value;        
        var marketingSmtpText = formPrincipal.down('#marketingSet').down('#marketingSmtpHost').value;
        var marketingUserEmail = formPrincipal.down('#marketingSet').down('#marketingUserEmail').value;
        var marketingPassword = formPrincipal.down('#marketingSet').down('#marketingPassword').value;

        var disableButton = (smtpText === "" 
                || imap === "" 
                || userEmail === ""
                || password === ""
                || marketingSmtpText === "" 
                || marketingUserEmail === ""
                || marketingPassword === "");        
        this.disableButtonSave(disableButton);
    },
    /**
     * Método que é chamado pelo callback da função de find das configurações de email. <br>
     * Método preenche os campos do form com o resultado da pesquisa.
     * 
     * @author André Sulivam
     * @param {type} record
     * @returns {undefined}
     */
    onFillFormEmailConfig: function (record) {
        if (record !== null) {
            var emailConfig = this.getEmailConfig();
            var formPrincipal = emailConfig.down('#emailconfigformpanel');  
            formPrincipal.loadRecord(record);         
            this.disableButtonSave(false);
            emailConfig.setLoading(false);
        }
    },
    /**
     * Método para habilitar ou desabilitar o botão de Salvar as configurações de email baseado no parâmetro enviado.
     * @author André Sulivam
     * @param {type} disableButton
     * @returns {undefined}
     */
    disableButtonSave: function (disableButton) {
        var emailConfig = this.getEmailConfig();
        var button = emailConfig.down('button#saveEmailConfig');
        button.setDisabled(disableButton);
    }
});

