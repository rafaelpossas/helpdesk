/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.controller.Perfil', {
    extend: 'Ext.app.Controller',
    views: ['Helpdesk.view.perfil.Perfil'],
    init: function () {
        this.control({
            'perfil #perfilSideMenuPanel > button': {
                click: this.onSideMenuButtonClick
            },
            'meuperfilsenhaform button#salvarButton': {
                click: this.saveChangesProfile
            },
            'meuperfilform button#salvarButton': {
                click: this.saveChangesProfile
            },
            'meuperfilform filefield': {
                change: this.onFilefieldChange
            }

        });
    },
    stores: ['Users'],
    refs: [
        {
            ref: 'cardPanel',
            selector: 'viewport > container#maincardpanel'
        },
        {
            ref: 'perfilCardPanel',
            selector: 'perfil > #perfilcardpanel'
        },
        {
            ref: 'emailMainHeader',
            selector: 'mainheader > container > label#emailMainHeader'
        }
    ],
    index: function () {
        this.getCardPanel().getLayout().setActiveItem(Helpdesk.Globals.perfilview);
        this.getPerfilCardPanel().getLayout().setActiveItem(Helpdesk.Globals.perfil_detalhes_view);
        this.setInformationsProfile();
    },
    onSideMenuButtonClick: function (btn) {
        if (btn.itemId === 'buttonPerfil') {
            this.getPerfilCardPanel().getLayout().setActiveItem(Helpdesk.Globals.perfil_detalhes_view);
            this.setInformationsProfile();
        }
        else if (btn.itemId === 'buttonPassword') {
            this.getPerfilCardPanel().getLayout().setActiveItem(Helpdesk.Globals.perfil_senha_view);
        }
    },
    /**
     * Ao se clicar em salvar as alterações de dados do usuário pela tela de Meu Perfil.<br>
     * (Senha ou dados cadastrais)
     * 
     * @author André Sulivam
     * @param {type} button
     * @returns {undefined}
     */
    saveChangesProfile: function (button) {
        var myScope = this;
        var form = button.up();
        var values = form.getValues();
        var user = Helpdesk.Globals.userLogged;
        var username = user.userName;
        var perfilCard = this.getPerfilCardPanel();
        
        var name = '';
        var email = '';
        var picture = '';
        var password = '';

        var perfilPanel = this.getPerfilCardPanel();
        var activeItem = this.getPerfilCardPanel().getLayout().getActiveItem();
        var activeIndex = perfilPanel.items.indexOf(activeItem);

        perfilCard.setLoading(translations.SAVING);
        if (activeIndex === Helpdesk.Globals.perfil_detalhes_view) {            
            name = values.name;
            email = values.email;
            picture = perfilCard.down('meuperfilform').down('image').src;
            password = '';
        } else if (activeIndex === Helpdesk.Globals.perfil_senha_view) {
            name = user.name;
            email = user.email;
            picture = user.picture;
            password = values.password;
        }

        this.getUsersStore().saveChangesUser(username, name, email, picture, password, function (response) {
            perfilCard.setLoading(false);
            if (response.responseText !== '') {
                if (activeIndex === Helpdesk.Globals.perfil_detalhes_view) {
                    var user = Ext.decode(response.responseText);
                    Helpdesk.Globals.userLogged = user;
                    form.down('textfield#nameProfile').setValue(user.name);
                    form.down('textfield#emailProfile').setValue(user.email);
                    form.down('image').setSrc(user.picture);
                    //Atualiza o email na barra de informações
                    myScope.getEmailMainHeader().setText(user.email);
                    Ext.Msg.alert(translations.INFORMATION, translations.USER + ' ' + translations.SAVED_WITH_SUCCESS);
                } else if (activeIndex === Helpdesk.Globals.perfil_senha_view) {
                    var user = Ext.decode(response.responseText);
                    Helpdesk.Globals.userLogged = user;
                    Ext.Msg.alert(translations.INFORMATION, translations.USER + ' ' + translations.SAVED_WITH_SUCCESS);
                    form.down('textfield#pass').setValue('');
                    form.down('textfield#passCheck').setValue('');
                }
            }
        });
    },
    /**
     * Preenche os campos da tela com os dados do usuário logado.
     * 
     * @author André Sulivam
     * @returns {undefined}
     */
    setInformationsProfile: function () {
        var user = Helpdesk.Globals.userLogged;
        var perfilForm = this.getPerfilCardPanel().down('meuperfilform');

        var name = perfilForm.down('#nameProfile');
        var email = perfilForm.down('#emailProfile');
        name.setValue(user.name);
        email.setValue(user.email);

        if (user.picture !== null) {
            var picture = perfilForm.down('image');
            picture.setSrc(user.picture);
        }
    },
    /**
     * Validando e atualizando imagem de perfil de usuário ao selecionar nova imagem.
     * 
     * @author André Sulivam
     * @param {type} filefield
     * @param {type} value
     * @param {type} options
     * @returns {undefined}
     */
    onFilefieldChange: function (filefield, value, options) {

        var file = filefield.fileInputEl.dom.files[0]; // #1

        var perfilCard = this.getPerfilCardPanel();
        var picture = perfilCard.down('meuperfilform').down('image'); // #2

        if (typeof FileReader !== "undefined" && (/image/i).test(file.type)) {                // #3
            var reader = new FileReader(); // #4
            reader.onload = function (e) {         // #5
                picture.setSrc(e.target.result); // #6
            };
            reader.readAsDataURL(file); // #7
        } else if (!(/image/i).test(file.type)) { // #8
            Ext.Msg.alert(translations.INFORMATION, translations.ONLY_UPLOAD_IMAGES);
            filefield.reset(); // #9
        }
    }
});

