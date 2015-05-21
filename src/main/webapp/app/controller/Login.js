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
        },
        {
            ref: 'loginView',
            selector: 'loginview'
        }
    ],
    init: function () {
        this.control({
            'loginform button#submit': {
                click: this.onSubmit
            },
            'credentialsexpiredwindow button#submit_credentials': {
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
            },
            'loginform button#forgotPwdBtn': {
                click: this.generateRetrievePasswordWindow
            },
            '#btnRetrieve': {
                click: this.generateNewPassword
            }
        });
    },
    /**
     * Variável usada para contabilizar os usuários que estão sendo criados pela tela de login. 
     * @author André Sulivam
     */
    numberUsersCreated: 0,
    /**
     * Validando texto de password no campo de login.
     * 
     * @param {type} field
     * @param {type} e
     * @param {type} options
     * @returns {undefined}
     */
    onTextfieldKeyPress: function (field, e, options) {
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
    /**
     * Validando os textos inseridos nos textfields de login.
     * 
     * @param {type} field
     * @param {type} e
     * @param {type} options
     * @returns {undefined}
     */
    onTextfieldSpecialKey: function (field, e, options) {
        if (e.getKey() === e.ENTER) {
            var submitBtn = field.up('form').down('button#submit');// Pega o elemento pai para depois buscar a referência ao botão
            var submitCredencials = Ext.ComponentQuery.query('credentialsexpiredwindow button#submit_credentials')[0];
            if (submitBtn !== null)
                submitBtn.fireEvent('click', submitBtn, e, options);

            if (submitCredencials !== null)
                submitCredencials.fireEvent('click', submitCredencials, e, options);
        }
    },
    /**
     * Validar e enviar os valores para credencial expirada.
     * 
     * @param {type} button
     * @param {type} e
     * @param {type} options
     * @returns {undefined}
     */
    onSubmitCredentials: function (button, e, options) {
        var formCredentials = button.up('form');
        var formLogin = Ext.ComponentQuery.query('#mainform')[0];
        var user = formLogin.getForm().findField('username').getValue();
        var newPassword = formCredentials.getForm().findField('new_password').getValue();
        var confirmPassword = formCredentials.getForm().findField('confirm_password').getValue();
        if (newPassword !== confirmPassword) {
            Ext.Msg.alert(translations.ERROR, translations.PASSWORD_NOT_MATCH);
        } else {
            formCredentials.getForm().findField('user').setValue(user);
            formCredentials.submit({
                success: function (obj, action) {
                    Ext.ComponentQuery.query('credentialsexpiredwindow')[0].close();
                    formLogin.getForm().findField('password').setValue(newPassword);
                    var submitButton = Ext.ComponentQuery.query('loginform button#submit')[0];
                    submitButton.fireEvent('click', submitButton);
                },
                failure: function (form, action) {
                    console.log("User Changed Failed");
                }
            });
        }
    },
    /**
     * Fazendo login.
     * 
     * @param {type} form
     * @returns {undefined}
     */
    loginSubmit: function (form) {
        var formTopElement = Ext.get(form.getEl()); // Busca pelo elemento superior que representa o componente (Neste caso o PANEL)
        formTopElement.mask(translations.AUTHENTICATING, 'loading'); // Adiciona a máscara de carregamento 
        form.submit({
            method: 'POST',
            success: function (obj, action) {
                formTopElement.unmask(); // Remove máscara de carregamento  
                window.location.href = "../" + homeURL;
            },
            failure: function (form, action) {
                formTopElement.unmask(); // Remove máscara de carregamento  
                var obj = Ext.JSON.decode(action.response.responseText);
                if (action.failureType === 'server') {
                    var translatedError = "";
                    if (obj.error === 'credentialsexpired' || obj.error === 'accountlocked') {
                        var credentialsExpiredWindow = Ext.create('Helpdesk.view.user.CredentialsExpiredWindow');
                        credentialsExpiredWindow.show();
                    } else {
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
    /**
     * Quando se clicar no botão de fazer login.
     * 
     * @param {type} button
     * @param {type} e
     * @param {type} options
     * @returns {undefined}
     */
    onSubmit: function (button, e, options) {
        var form = button.up('form');
        this.loginSubmit(form);
    },
    /**
     * Criando tela para criação de novo usuário no sistema através da tela de login.
     * 
     * @param {type} button
     * @param {type} e
     * @param {type} options
     * @returns {undefined}
     */
    onButtonClickSignIn: function (button, e, options) {
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
    /**
     * 
     * @param {type} button
     * @param {type} e
     * @param {type} options
     * @returns {undefined}
     */
    onSignInCriarConta: function (button, e, options) {

        var form = button.up('form');
        var record = form.getRecord();
        var values = form.getValues();
        values.isEnabled = true;
        values.userName = values.email;
        record.set(values);

        this.getUsersStore().add(record);
        var myscope = this;
        var loginView = this.getLoginView();
        loginView.setLoading(translations.SAVING);
        this.getUsersStore().saveNewUserByLoginScreen(record, function (result) {
            loginView.setLoading(false);
            // usuários criados pela tela de login
            var users = result.events.operationcomplete.listeners[0].scope.data.items;

            // usuario da ultima tentativa
            var currentUser = users[myscope.numberUsersCreated];

            if (currentUser.data.id !== null && currentUser.data.id !== "") {
                Ext.Msg.alert(translations.INFORMATION, translations.USER + ' ' + translations.CREATED_WITH_SUCCESS);
//                Ext.Ajax.request({
//                    url: 'j_spring_security_check',
//                    method: 'POST',
//                    params: {
//                        j_username: currentUser.data.userName,
//                        j_password: currentUser.data.password
//                    },
//                    success: function (o) {
//                        window.location.href = "../" + homeURL;
//                    }
//                });
            } else {
                Ext.Msg.alert(translations.INFORMATION, translations.USER_NOT_CREATED + '. ' + translations.CHECK_THE_ENTERED_VALUES + '.');
            }
            // incrementando o valor da variável de número de usuários criados para o próximo teste.
            myscope.numberUsersCreated = myscope.numberUsersCreated + 1;
        });
        form.up('.window').close();
    },
    /**
     * Cancelando a criação de nova conta de usuário.
     * 
     * @param {type} button
     * @param {type} e
     * @param {type} options
     * @returns {undefined}
     */
    onSignInVoltar: function (button, e, options) {
        var form = button.up('form');
        form.up('.window').close();
    },
    /**
     * Criando tela para geração de novo password ao usuário.
     * 
     * @returns {undefined}
     */
    generateRetrievePasswordWindow: function () {
        var window = Ext.create('Ext.window.Window', {
            title: translations.RETRIEVE_PASSWORD,
            width: 500,
            height: 75,
            modal: true,
            dynamic: true,
            items: [
                {
                    xtype: 'panel',
                    layout: 'hbox',
                    align: 'stretch',
                    height: 50,
                    items: [
                        {
                            xtype: 'label',
                            text: translations.USER,
                            padding: '13 5 10 10'
                        },
                        {
                            xtype: 'textfield',
                            itemId: 'userNameRetrieveValue',
                            width: 335,
                            padding: '10 10 10 5'
                        },
                        {
                            xtype: 'button',
                            margin: '10 0 0 0',
                            itemId: 'btnRetrieve',
                            text: translations.RETRIEVE
                        }
                    ]
                }
            ]

        });
        window.show();
    },
    /**
     * Gerando novo password ao usuario
     * 
     * @param {type} btn
     * @returns {undefined}
     */
    generateNewPassword: function (btn) {
        var form = btn.up();
        var userName = form.down('textfield#userNameRetrieveValue').getValue();
        var usersStore = this.getUsersStore();
        if (form.down('textfield#userNameRetrieveValue').getValue() !== '') {
            form.setLoading(translations.PLEASE_WAIT);
            usersStore.resetPasswordUser(userName, localStorage.getItem('user-lang'), function (o) {
                var decodedString = Ext.decode(o.responseText);
                form.setLoading(false, false);
                if (decodedString.status === translations.CHANGE_PASSWORD_COMPLETE) {
                    Ext.Msg.alert(translations.INFORMATION, translations.CHANGE_PASSWORD_COMPLETE_MESSAGE);
                    form.up().close();
                } else if (decodedString.status === translations.INVALID_USERNAME) {
                    Ext.Msg.alert(translations.INFORMATION, translations.INVALID_USERNAME_MESSAGE);
                }
            });
        } else {
            Ext.Msg.alert(translations.INFORMATION, translations.BLANK_VARIABLE_MESSAGE);
        }
    }
});