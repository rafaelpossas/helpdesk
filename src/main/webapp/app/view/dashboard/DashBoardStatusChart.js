Ext.define('Helpdesk.view.dashboard.DashBoardStatusChart', {
            extend:'Ext.chart.Chart',
            alias:'widget.dashboardstatuschart',            
            animate: true,
            store: 'TicketsStatus',
            shadow: true,
            style: 'background:#fff',
            legend: {
                position: 'right'
            },
            insetPadding: 60,
            theme: 'Base:gradients',
            series: [{
                type: 'pie',
                field: 'count',
                showInLegend: true,
                donut: false,
                tips: {
                  trackMouse: true,
                  width: 200,
                  height: 28,
                  renderer: function(storeItem, item) {                    
                    this.setTitle(storeItem.get('description') + ': ' + storeItem.get('count') + ' Tickets');
                  }
                },
                highlight: {
                  segment: {
                    margin: 20
                  }
                },
                label: {
                    field: 'description',
                    display: 'rotate',
                    contrast: true,
                    font: '18px Arial'
                }
            }]
        });