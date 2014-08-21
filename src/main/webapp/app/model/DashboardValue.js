Ext.define('Helpdesk.model.DashboardValue',{
   extend: 'Ext.data.Model',
   idProperty: 'id',
   fields: [
       {name: 'type'},
       {name: 'description'},
       {name: 'count'}
   ]
});

