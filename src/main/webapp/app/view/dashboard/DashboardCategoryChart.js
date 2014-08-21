Ext.define('Helpdesk.view.dashboard.DashboardCategoryChart', {
    alias:'widget.dashboardcategory',
    extend:'Ext.chart.Chart',
    style: 'background:#fff',
    animate: true,
    shadow: true,
    store: 'TicketsByCategory',
    axes: [{
            type: 'Numeric',
            position: 'left',
            fields: ['count'],
            label: {
                renderer: Ext.util.Format.numberRenderer('0,0')
            },
            title: translations.NUMBER_OF_TICKETS,
            grid: true,
            minimum: 0
        }, {
            type: 'Category',
            position: 'bottom',
            fields: ['description'],
            title: translations.CATEGORIES
        }],
    series: [{
            type: 'column',
            axis: 'left',
            highlight: true,
            tips: {
                trackMouse: true,
                width: 200,
                height: 28,
                renderer: function(storeItem, item) {
                    if(storeItem.get('count')>1){
                        this.setTitle(storeItem.get('description') + ': ' + storeItem.get('count') + ' Tickets'); 
                    }else{
                        this.setTitle(storeItem.get('description') + ': ' + storeItem.get('count') + ' Ticket');
                    }                                      
                }
            },
            label: {
                display: 'insideEnd',
                'text-anchor': 'middle',
                field: 'id',
                renderer: Ext.util.Format.numberRenderer('0'),
                orientation: 'vertical',
                color: '#1e62d0'
            },
            xField: 'category',
            yField: 'count',            
            renderer: function(sprite, record, attr, index, store){
                return Ext.apply(attr, {
                    fill: '#1e62d0'
                });
            }
            
            
        }]
});
