/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.category.CategoryGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.categorygrid',
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2
        })
    ],
    stores: ['Categories'],
    requires: ['Helpdesk.store.Categories'],
    border:0,
    cls:'grid-style-header',
    constructor: function(config) {
        this.param = config.param; // get your param value from the config object
        config.store = Ext.create('Helpdesk.store.Categories', {}); // Blank Configuration needs to be passed in order to trigger the constructor call of the class
        this.callParent(arguments);
    },
    viewConfig: {
        stripeRows: false
    },
    columns: {
        items: [
            {
                header: translations.ID,
                flex:1,
                dataIndex: 'id'
            },{
                header: translations.NAME,
                flex:5,
                dataIndex: 'name',
                editor: {
                    xtype: 'textfield',
                    height: 30
                }
                
            }],
        defaults: {
           tdCls: 'grid-style-row'
        }
    }
});

