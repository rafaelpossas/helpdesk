/* 
 * @Author: rafaelpossas
 * 
 * This controller is responsible for creating the login view, listening for the events
 * dispatched by this view and redirecting the user to the main application, moreover
 * it will parse and display any errors returned from the server and/or dispatched by 
 * the login form.
 * 
 * The form has a Caps Lock warning that will be shown to the user whenever the key
 * is active on the keyboard. The function which this resposibility was assigned is
 * onTextfieldKeyPress. This function will listen for every character typed by the user
 * hence if this character is in uppercase the tooltip will be showed.
 * 
 * This controller was declared in the login.js file which can be located at the root
 * folder of the application.
 * 
 * Views:
 *    view/login/Login.js
 *    view/login/LoginForm.js
 *    view/login/CapsLockTooltip.js
 */
Ext.define('Helpdesk.controller.Login', {
    extend: 'Ext.app.Controller',
    requires: ['Helpdesk.store.Users'],
    views: ['login.Login'],
    stores: 'Users',
    refs: [
        {
            ref: 'capslockTooltip',
            selector: 'capslocktooltip'
        }
    ],
    init: function() {
        this.control({
            'loginform button#submit': {
                click: this.onSubmit
            },
            'credentialsexpiredwindow button#submit_credentials':{
                click: this.onSubmitCredentials
            },
            'loginform form textfield': {
                specialkey: this.onTextfieldSpecialKey
            },
            'loginform form textfield[id=password]': {
                keypress: this.onTextfieldKeyPress
            },
            'credentialsexpiredwindow form textfield': {
                keypress: this.onTextfieldSpecialKey
            },
            '#signIn': {
                click: this.onButtonClickSignIn
            },
            'signinform button#criarConta': {
                click: this.onSignInCriarConta
            },
            'signinform button#voltar': {
                click: this.onSignInVoltar
            }

        });

    },
    onTextfieldKeyPress: function(field, e, options) {
        var charCode = e.getCharCode();
        if ((e.shiftKey && charCode >= 97 && charCode <= 122) ||
                (!e.shiftKey && charCode >= 65 && charCode <= 90)) {

            if (this.getCapslockTooltip() === undefined) {
                Ext.widget('capslocktooltip');
            }
            this.getCapslockTooltip().show();

        } else {

            if (this.getCapslockTooltip() !== undefined) {
                this.getCapslockTooltip().hide();
            }
        }

    },
    onTextfieldSpecialKey: function(field, e, options) {
        if (e.getKey() === e.ENTER) {
            var submitBtn = field.up('form').down('button#submit');// Pega o elemento pai para depois buscar a referência ao botão
            var submitCredencials = Ext.ComponentQuery.query('credentialsexpiredwindow button#submit_credentials')[0];
            if(submitBtn!== null)
                submitBtn.fireEvent('click', submitBtn, e, options);
            
            if(submitCredencials !== null)
                submitCredencials.fireEvent('click', submitCredencials, e, options);
        }
    },
    onSubmitCredentials: function(button, e, options){
        var formCredentials = button.up('form');
        var formLogin = Ext.ComponentQuery.query('#mainform')[0];
        var user = formLogin.getForm().findField('username').getValue();
        var newPassword = formCredentials.getForm().findField('new_password').getValue();
        var confirmPassword = formCredentials.getForm().findField('confirm_password').getValue();
        if(newPassword !== confirmPassword){
            Ext.Msg.alert(translations.ERROR, translations.PASSWORD_NOT_MATCH);
        }else{
            formCredentials.getForm().findField('user').setValue(user);
            formCredentials.submit({
                success: function(obj, action){
                    Ext.ComponentQuery.query('credentialsexpiredwindow')[0].close();
                    formLogin.getForm().findField('password').setValue(newPassword);
                    var submitButton = Ext.ComponentQuery.query('loginform button#submit')[0];
                    submitButton.fireEvent('click',submitButton);

                },
                failure: function(form,action){
                    console.log("User Changed Failed");
                }
            });
        }

    },
    loginSubmit: function(form){
        console.log("loginSubmit");
        var formTopElement = Ext.get(form.getEl()); // Busca pelo elemento superior que representa o componente (Neste caso o PANEL)
        formTopElement.mask(translations.AUTHENTICATING, 'loading'); // Adiciona a máscara de carregamento 
        form.submit({
            method: 'POST',
            success: function(obj, action) {
                formTopElement.unmask(); // Remove máscara de carregamento  
                window.location.href = "../" + homeURL;
            },
            failure: function(form, action) {
                formTopElement.unmask(); // Remove máscara de carregamento  
                var obj = Ext.JSON.decode(action.response.responseText);
                console.log(action);
                if (action.failureType === 'server') {
                    var translatedError = "";
                    if (obj.error === 'credentialsexpired' || obj.error === 'accountlocked') {
                        var credentialsExpiredWindow = Ext.create('Helpdesk.view.user.CredentialsExpiredWindow');
                        credentialsExpiredWindow.show();
                    } else{
                        if (obj.error === 'badcredentials') {
                            translatedError = translations.BAD_CREDENTIALS;
                        }
                        if (obj.error === 'accountdisabled') {
                            translatedError = translations.ACCOUNT_DISABLED;
                        }
                        Ext.Msg.alert(translations.LOGIN_FAILED, translatedError);
                    }
                } else {
                    Ext.Msg.alert(translations.ERROR, translations.CONNECTING_ERROR);

                }
            }
        });
    },
    onSubmit: function(button, e, options) {
        var form = button.up('form');
        this.loginSubmit(form);

    },
    onButtonClickSignIn: function(button, e, options) {
        var win = Ext.create('Ext.window.Window', {
            title: translations.SIGN_IN,
            layout: 'fit',
            modal: true,
            minWidth: 400,
            maxWidth: 400,
            minHeight: 360,
            resizable: true,
            dynamic: true,
            items: {
                xtype: 'signinform'
            }
        });
        win.down('form').loadRecord(Ext.create('Helpdesk.model.User'));
        win.show();
    },
    onSignInCriarConta: function(button, e, options) {

        var form = button.up('form');
        var record = form.getRecord();
        var values = form.getValues();
        values.isEnabled = true;
        values.userName = values.email;
        record.set(values);

        this.changeUserStoreProperties(0);
        this.getUsersStore().add(record);
        var myscope = this;
        this.getUsersStore().sync({
            callback: function() {
                myscope.changeUserStoreProperties(1);

                Ext.Ajax.request({
                    url: 'j_spring_security_check',
                    method: 'POST',
                    params: {
                        j_username: values.userName,
                        j_password: values.password
                    },
                    success: function(o) {
                        window.location.href = "../" + homeURL;
                    }
                });
            }
        });

        form.up('.window').close();
    },
    onSignInVoltar: function(button, e, options) {
        var form = button.up('form');
        form.up('.window').close();
    },
    /**
     * 0 - Antes de utilizar a store dentro do login
     * 1 - Depois de utilizar a store dentro do login
     */
    changeUserStoreProperties: function(tipo) {
        if (tipo === 0) {
            this.getUsersStore().proxy.url = "login";
            Ext.override(this.getUsersStore(), {
                onCreateRecords: function(success, rs, data) {
                }
            });
        }
        else if (tipo === 1) {
            this.getUsersStore().proxy.url = "user";
            Ext.override(this.getUsersStore(), {
                onCreateRecords: function(success, rs, data) {
                    if (success) {
                        Ext.Msg.alert(translations.INFORMATION, translations.USER + ' ' + translations.SAVED_WITH_SUCCESS);
                    }
                }
            });
        }
    }
});