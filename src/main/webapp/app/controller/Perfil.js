/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.controller.Perfil', {
    extend: 'Ext.app.Controller',
    views: ['Helpdesk.view.perfil.Perfil'],
    init: function() {
        this.control({
            'perfil #perfilSideMenuPanel > button': {
                click: this.onSideMenuButtonClick
            },
            'meuperfilsenhaform button#salvarButton': {
                click: this.saveChangesPassword
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
    index: function() {
        this.getCardPanel().getLayout().setActiveItem(Helpdesk.Globals.perfilview);
        this.getPerfilCardPanel().getLayout().setActiveItem(Helpdesk.Globals.perfil_detalhes_view);
        this.setInformationsProfile();
    },
    onSideMenuButtonClick: function(btn) {
        if (btn.itemId === 'buttonPerfil') {
            this.getPerfilCardPanel().getLayout().setActiveItem(Helpdesk.Globals.perfil_detalhes_view);
            this.setInformationsProfile();
        }
        else if (btn.itemId === 'buttonPassword') {
            this.getPerfilCardPanel().getLayout().setActiveItem(Helpdesk.Globals.perfil_senha_view);
        }
    },
    saveChangesProfile: function(button) {

        var form = button.up();
        var values = form.getValues();
        var myScope = this;

        var perfilCard = this.getPerfilCardPanel();
        var picture = perfilCard.down('meuperfilform').down('image');

        Ext.Ajax.request({
            url: 'user/update-profile/' + Helpdesk.Globals.userLogged.userName,
            method: 'POST',
            // requisição enviando password vazio pois o método é o mesmo de atualização de password
            params: {
                name: values.name,
                email: values.email,
                picture: picture.src,
                password: ''
            },
            success: function(response) {
                if (response.responseText !== '') {
                    var user = Ext.decode(response.responseText);
                    Helpdesk.Globals.userLogged = user;
                    form.down('textfield#nameProfile').setValue(user.name);
                    form.down('textfield#emailProfile').setValue(user.email);
                    form.down('image').setSrc(user.picture);
                    //Atualiza o email na barra de informações
                    myScope.getEmailMainHeader().setText(user.email);
                    Ext.Msg.alert(translations.INFORMATION, translations.USER + ' ' + translations.SAVED_WITH_SUCCESS);
                }
            }
        });

    },
    //Salva a mudança de senha do usuário
    saveChangesPassword: function(button) {

        var form = button.up();
        var values = form.getValues();
        var user = Helpdesk.Globals.userLogged;
        
        Ext.Ajax.request({
            url: 'user/update-profile/' + Helpdesk.Globals.userLogged.userName,
            method: 'POST',
            params: {
                name: user.name,
                email: user.email,
                picture: user.picture,
                password: values.password
            },
            success: function(response) {
                if (response.responseText !== '') {
                    var user = Ext.decode(response.responseText);
                    Helpdesk.Globals.userLogged = user;
                    Ext.Msg.alert(translations.INFORMATION, translations.USER + ' ' + translations.SAVED_WITH_SUCCESS);
                    form.down('textfield#pass').setValue('');
                    form.down('textfield#passCheck').setValue('');
                }
            }
        });

    },
    setInformationsProfile: function() {
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
    onFilefieldChange: function(filefield, value, options) {

        var file = filefield.fileInputEl.dom.files[0]; // #1

        var perfilCard = this.getPerfilCardPanel();
        var picture = perfilCard.down('meuperfilform').down('image'); // #2

        if (typeof FileReader !== "undefined" && (/image/i).test(file.type)) {                // #3
            var reader = new FileReader(); // #4
            reader.onload = function(e) {         // #5
                picture.setSrc(e.target.result); // #6
            };
            reader.readAsDataURL(file); // #7
        } else if (!(/image/i).test(file.type)) { // #8
            Ext.Msg.alert(translations.INFORMATION, translations.ONLY_UPLOAD_IMAGES);
            filefield.reset(); // #9
        }
    }
});

