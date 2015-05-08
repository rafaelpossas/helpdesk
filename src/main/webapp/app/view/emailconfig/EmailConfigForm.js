/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.emailconfig.EmailConfigForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.emailconfigform',
    id: 'emailConfigForm',
    bodyPadding: 5,
    layout: {
        type: 'column'
    },
    requires: ['Helpdesk.store.EmailConfigs'],
    border: 0,
    items: [
        {
            xtype: 'fieldset',
            title: translations.EMAIL_CONFIGURATIONS,
            id: 'defaultSet',
            width: 400,
            height: 140,
            defaults: {
                beforeLabelTextTpl: Helpdesk.util.Util.required,
                xtype: 'textfield',
                allowBlank: false,
                labelWidth: 60,
                anchor: '100%'
            },
            items: [
                {
                    xtype: 'hiddenfield',
                    name: 'id',
                    id: 'hiddenid'
                },
                {
                    xtype: 'hiddenfield',
                    name: 'socketFactoryPort',
                    id: 'hiddensocketfactoryport'
                },
                {
                    xtype: 'hiddenfield',
                    name: 'auth',
                    id: 'hiddenauth'
                },
                {
                    xtype: 'hiddenfield',
                    name: 'smtpPort',
                    id: 'hiddensmtpport'
                },                
                {
                    fieldLabel: translations.SMTP,
                    name: 'smtpHost',
                    itemId: 'smtpHost'
                },
                {
                    fieldLabel: translations.IMAP,
                    name: 'imap',
                    itemId: 'imap'
                },
                {
                    fieldLabel: translations.EMAIL,
                    name: 'userEmail',
                    itemId: 'userEmail'
                },
                {
                    inputType: 'password',
                    fieldLabel: translations.PASSWORD,
                    name: 'password',
                    itemId: 'password'
                }
            ]
        },
        {
            xtype: 'fieldset',
            title: translations.EMAIL_CONFIGURATIONS_MARKETING,
            width: 400,
            id: 'marketingSet',
            height: 140,
            margin: '0 0 0 50',
            defaults: {
                beforeLabelTextTpl: Helpdesk.util.Util.required,
                xtype: 'textfield',
                allowBlank: false,
                labelWidth: 60,
                anchor: '100%'
            },
            items: [
                {
                    fieldLabel: translations.SMTP,
                    name: 'marketingSmtpHost',
                    itemId: 'marketingSmtpHost'
                },
                {
                    fieldLabel: translations.EMAIL,
                    name: 'marketingUserEmail',
                    itemId: 'marketingUserEmail'
                },
                {
                    inputType: 'password',
                    fieldLabel: translations.PASSWORD,
                    name: 'marketingPassword',
                    itemId: 'marketingPassword'
                }
            ]
        }
    ]
});
