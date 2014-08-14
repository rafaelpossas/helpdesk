Ext.define('Helpdesk.view.perfil.MeuPerfilForm', {
    extend: 'Ext.form.Panel',  
    alias: 'widget.meuperfilform',

    layout: {
        type: 'vbox'
    },
    border: false,
    bodyPadding: 30,
    
    defaults: {
        xtype: 'textfield',
        anchor: '100%',
        allowBlank: false,        
        minLength: 3,
        msgTarget: 'under',
        labelStyle: 'font-weight:bold;padding:5px;',
        labelAlign: 'top'        
    },
    items: [
        {
            fieldLabel: translations.NAME,
            name: 'name',
            value: Helpdesk.Globals.userLogged.name,
            width: 500,
            itemId:'nameProfile'
        },     
        {
            fieldLabel: translations.EMAIL,
            maxLength: 100,
            name: 'email',
            minLength: 0,
            value: Helpdesk.Globals.userLogged.email,
            width: 500,
            padding: '10 0 20 0',
            itemId:'emailProfile'
        },
        {
            xtype: 'filefield',
            fieldLabel: translations.PICTURE,
            emptyText: translations.SELECT_A_PROFILE_PICTURE,
            buttonText: translations.BROWSE,
            allowBlank: true,
            beforeLabelTextTpl: '',
            listeners: {
                change: function(view, value, eOpts) {
                    var parent = this.up('form');
                    parent.onFileChange(view, value, eOpts);
                }
            }
        },{
            xtype: 'fieldset',
            title: translations.PICTURE,
            width: 170, // #1
            items: [
                {
                    xtype: 'image', // #2
                    width: 150,
                    height: 200,
                    name: 'picture',
                    src: ''
                }
            ]
        },
        {
            xtype: "button",
            itemId: "salvarButton",
            text: translations.SAVE,
            cls: 'blue_button',
            scale: "medium",
            formBind:true
        }
    ],
    onFileChange: function(view, value, eOpts) {
        var fileNameIndex = value.lastIndexOf("/") + 1;
        if (fileNameIndex === 0) {
            fileNameIndex = value.lastIndexOf("\\") + 1;
        }
        var filename = value.substr(fileNameIndex);

        var IsValid = this.fileUpload(filename, view);
        if (!IsValid) {
            return;
        }
    },
    fileUpload: function(val, field) {
        var fileName = /^.*\.(gif|png|bmp|jpg|jpeg)$/i;
        return fileName.test(val);
    }
});