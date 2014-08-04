/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.home.MainHeader', {
    extend: 'Ext.toolbar.Toolbar',
    requires: ['Helpdesk.Globals'],
    alias: 'widget.mainheader', // #2
    itemId: 'main-nav-toolbar',
    height: 75, // #3
    layout: {
        type: 'hbox',
        align: 'bottom'
    },
    defaults: {        
        toggleGroup: 'main-nav',
        allowDepress: false
    },
    padding: 0,
    style: 'border-bottom: 4px solid #1e62d0;',
    items: [
        {
            xtype: "image",
            src: homeURL + translations.PROCYMO_LOGO,
            border: 0,
            style: 'margin-right: 50px; margin-left: 10px;',
            height: 65,
            width: 196
        },
        {
            xtype: 'button',
            itemId: 'home',
            text: translations.HOME,            
            baseCls: 'tab-button',
            hidden: true
        },
        {
            xtype: 'button',
            text: translations.TICKETS,
            itemId: 'ticket',
            baseCls: 'tab-button',
            hidden: true
        },
        {
            xtype: 'button',
            text: translations.REPORTS,
            itemId: 'reports',
            baseCls: 'tab-button',
            hidden: true
        },
        {
            xtype: 'tbfill'
        },
        {
            xtype: 'container',
            height: '100%',
            padding: '15',            
            defaults: {
                toggleGroup: 'main-nav',
                allowDepress: false
            },
            layout: {
                type: 'hbox',
                align: 'top'             
            },
            items: [
                {
                    xtype: 'label',
                    text: Helpdesk.Globals.userLogged.email,
                    margin: '3 15 0 0',
                    cls: 'font_style_header',
                    itemId:'emailMainHeader'
                },
                {
                    xtype: 'button',
                    itemId: 'perfil',
                    iconCls: 'profile_16',
                    style: 'border-style: none !important;background: transparent !important;',
                    text: translations.MY_PROFILE
                },
                {
                    xtype: 'button',
                    itemId: 'settings',
                    iconCls: 'config_16',
                    style: 'border-style: none !important;background: transparent !important;',
                    text: translations.CONFIGURATION
                },
                {
                    xtype: 'button',
                    style: 'border-style: none !important;background: transparent !important;',
                    iconCls: 'logout_16',
                    itemId: 'logout',
                    text: translations.LOGOUT
                }
            ]

        }
    ]
});

