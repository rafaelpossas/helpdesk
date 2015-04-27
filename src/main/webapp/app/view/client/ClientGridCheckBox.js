/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.client.ClientGridCheckBox', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.clientgridcheckbox',
    stores: ['Clients'],
    requires: ['Helpdesk.store.Clients'],
    border: 0,
    autoScroll: true,
    cls: 'grid-style-header',
    constructor: function (config) {
        this.param = config.param; // get your param value from the config object
        config.store = Ext.create('Helpdesk.store.Clients', {}); // Blank Configuration needs to be passed in order to trigger the constructor call of the class
        this.callParent(arguments);
    },
    viewConfig: {
        stripeRows: false
    },
    selModel: Ext.create('Ext.selection.CheckboxModel', {
        columns: [
            {xtype: 'checkcolumn', dataIndex: 'id'}
        ]
    }),
    columns: {
        items: [
            {
                width: 200,
                dataIndex: 'name',
                flex: 1,
                text: translations.NAME_CLIENT
            }
        ],
        defaults: {
            tdCls: 'grid-email-style-row'
        }
    }
});

