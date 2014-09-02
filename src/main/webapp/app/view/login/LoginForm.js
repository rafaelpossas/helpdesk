/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.login.LoginForm', {
    
    extend: 'Ext.panel.Panel',
    alias: 'widget.loginform',
    
    height: 225,
    width: 400,
    layout: {
        type: 'fit'
    },
    iconCls: 'key',
    title: translations.LOGIN,
    items: [
        {
            xtype: 'form',
            itemId: 'mainform',
            url: 'j_spring_security_check',
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
                    name: 'j_username',
                    fieldLabel: translations.USER,
                    id: 'username'
                },
                {
                    inputType: 'password',
                    name: 'j_password',
                    fieldLabel: translations.PASSWORD,
                    enableKeyEvents: true,
                    id: "password",
                    maxLength: 25
                },
                {
                    xtype: 'checkbox',
                    name: '_spring_security_remember_me',
                    fieldLabel: translations.REMEMBER,
                    padding:'0 0 10 0',
                },
                {
                    xtype:'button',                    
                    itemId:'forgotPwdBtn',
                    baseCls:'forgot-password-button',
                    text:translations.FORGOT_PASSWORD
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        {
                            xtype: 'translation'
                        },
                        {
                            xtype: 'tbfill'
                        },
                        {
                            xtype: 'button',
                            itemId: 'submit',
                            formBind: true,
                            iconCls: 'submit_16',
                            text: translations.ENTER
                        }
                    ]
                }
            ]
        }
    ]
});