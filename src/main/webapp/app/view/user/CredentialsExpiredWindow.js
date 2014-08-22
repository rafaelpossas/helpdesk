/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.user.CredentialsExpiredWindow', {
    extend: 'Ext.window.Window',
    title: 'Senha expirada',
    alias: 'widget.credentialsexpiredwindow',
    height: 200,
    width: 400,
    layout: 'fit',
    modal: true,
    config:{
        user: ''
    },
    items: [
        {
            xtype: 'form',
            itemId: 'mainform_credentials',
            url: 'credentials',
            frame: true,
            bodyPadding: 15,
            defaults: {
                xtype: 'textfield',
                anchor: '100%',
                labelWidth: 100,
                allowBlank: false,
                minLength: 3,
                msgTarget: 'under'
                
            },
            items: [
                {
                    xtype: 'container',
                    html:  'A sua senha expirou, é necessário cadastrar um nova',
                    width: 350,
                    height: 30,
                    style:{
                        'text-align': 'center',
                        'font-weight' : 'bold'
                    }
                    
                },
                {
                    xtype: 'hidden',
                    name: 'user'
                    
                },
                {
                    name: 'new_password',
                    inputType: 'password',
                    fieldLabel: 'Nova Senha',
                    id: 'new_password',
                    maxLength: 15
                },
                {
                    inputType: 'password',
                    name: 'confirm_password',
                    fieldLabel: 'Confirmar Senha',
                    enableKeyEvents: true,
                    id: 'confirm_password',
                    maxLength: 25
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        {
                            xtype: 'tbfill'
                        },
                        {
                            xtype: 'button',
                            itemId: 'submit_credentials',
                            formBind: true,
                            iconCls: 'submit_16',
                            text: translations.SAVE
                        }
                    ]
                }
            ]
        }
    ]
});