/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.sendemail.SendEmailForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.sendemailform',
    id: 'sendEmailForm',
    bodyPadding: 5,
    requires: ['Helpdesk.view.client.ClientGridCheckBox'],
    border: 0,
    defaults: {
        beforeLabelTextTpl: Helpdesk.util.Util.required,
        allowBlank: false,
        anchor: '100%'
    },
    autoScroll: true,
    items: [
        {
            xtype: 'textfield',
            fieldLabel: translations.SUBJECT,
            id: 'subject'
        },
        {
            xtype: 'filefield',
            regex: /^.*(\.tiff)|(\.jpg)|(\.jpeg)|(\.gif)|(\.jpe)|(\.tif)|(\.png)$/i,
            allowBlank: true,
            buttonOnly: true,
            margin: '0 0 0 105',
            buttonText: translations.INSERT_IMAGE,
            buttonConfig: {
                id: 'buttonBrowser',
                iconCls: 'icon_image_16',
                tooltip: '<b>' + translations.INSERT_IMAGE + '</b><br>' + translations.INSERT_IMAGE_ON_BODY_EMAIL
            },
            id: 'insertImage',
            iconCls: 'icon_image_16'
        },
        {
            xtype: 'htmleditor',
            fieldLabel: translations.MESSAGE,
            height: 400,
            id: 'htmleditormessage'
//            listeners: {
//                afterrender: function () {
//                    var toolbar = this.getToolbar();
//                    toolbar.insert(21, [
//                        {
//                            xtype: 'filefield',
//                            regex: /^.*(\.tiff)|(\.jpg)|(\.jpeg)|(\.gif)|(\.jpe)|(\.tif)|(\.png)$/i,
//                            allowBlank: true,
//                            buttonOnly: true,
//                            buttonText: '',
//                            buttonConfig: {
//                                id: 'buttonBrowser',
//                                iconCls: 'icon_image_16',
//                                tooltip: '<b>' + translations.INSERT_IMAGE + '</b><br>' + translations.INSERT_IMAGE_ON_BODY_EMAIL,
//                                text: ''
//                            },
//                            id: 'insertImage',
//                            iconCls: 'icon_image_16'
//                        }
//                    ]);
//                }
//            }
        },
        {
            xtype: 'clientgridcheckbox'
        }
    ]
});
