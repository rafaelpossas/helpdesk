Ext.define('Helpdesk.util.PagingToolBar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.custompagingtoolbar',
    totalRecords:0,
    items: [
        { //0
            xtype: 'button',
            itemId: 'btnFirst',
            iconCls: Ext.baseCSSPrefix + 'tbar-page-first'
        },
        {   //1
            xtype: 'button',
            itemId: 'btnPrev',
            iconCls: Ext.baseCSSPrefix + 'tbar-page-prev'
        }, 
        '', //2
        '-', //3
        '', //4
        {   //5
            xtype: 'text',
            text: translations.PAGE     
        },
        '', //6
        {   //7
            xtype: 'textfield',
            itemId: 'pageItem',
            maskRe: /^[0-9]/,
            width: 35
        },
        '', //8
        {   //9
            xtype: 'text',
            text: translations.OF       
        },
        '', //10
        {   //11
            xtype: 'text'
        },
        '',//12
        '-',//13
        '',//14
        {   //15
            xtype: 'button',
            itemId: 'btnNext',
            iconCls: Ext.baseCSSPrefix + 'tbar-page-next'
        },
        {   //16
            xtype: 'button',
            itemId: 'btnLast',
            iconCls: Ext.baseCSSPrefix + 'tbar-page-last'
        },  
        '->',   //17
        {        //18
            xtype: 'text',
            //text: this.pageNumber,
            padding: '0 2 0 2',
            style: 'font-weight: bold; font-size:13px'            
        },
        {       //19
            xtype: 'text',
            text: translations.TO,
            padding: '0 2 0 2',
            style: 'font-weight: bold; font-size:13px'
        },
        {       //20
            xtype: 'text',
            //text: this.totalRecords > Helpdesk.Globals.pageSizeGrid?(Helpdesk.Globals.pageSizeGrid*this.pageNumber): this.totalRecords,
            padding: '0 2 0 2',
            style: 'font-weight: bold; font-size:13px'
        },
        {       //21
            xtype: 'text',
            text: translations.OF,
            padding: '0 2 0 2',
            style: 'font-weight: bold; font-size:13px'
        },
        {       //22
            xtype: 'text',
            padding: '0 2 0 2',
            style: 'font-weight: bold; font-size:13px'
        },
        {       //23
            xtype: 'text',
            text: translations.RECORDS,
            padding: '0 10 0 2',
            style: 'font-weight: bold; font-size:13px'
        },
        {
            //24
            xtype: 'text',
            text: translations.NO_RECORDS_TO_DISPLAY,
            padding: '0 10 0 2',
            style: 'font-weight: bold; font-size:13px'
        }
    ],
    
    refreshPagingToolBar:function(pageNumber,totalRecords){
        this.changeButtonsStatus(pageNumber,totalRecords);
        
        if(totalRecords > 0){
            this.visibilityChange(true);
        }
        else{
            this.visibilityChange(false);
        }
        
        
        var pageItem = this.items.items[7];
        var totalPages = this.items.items[11];
        var startRecord = this.items.items[18];        
        var endRecord = this.items.items[20];
        var endRecordValue = 0;        
        var totalRecord = this.items.items[22];
        
        if(totalRecords <= 0){
            totalPages.setText(1);
        }
        else{
            totalPages.setText(Math.ceil(totalRecords/Helpdesk.Globals.pageSizeGrid));
        }
        
        pageItem.setValue(pageNumber);
        startRecord.setText(1+((pageNumber-1)*Helpdesk.Globals.pageSizeGrid));
        
        endRecordValue = pageNumber*Helpdesk.Globals.pageSizeGrid;
        if(endRecordValue > totalRecords){
            endRecord.setText(totalRecords);
        }
        else{
            endRecord.setText(endRecordValue);
        }
        
        totalRecord.setText(totalRecords);
    },
    
    visibilityChange: function(visible){
        if(visible){
            this.items.items[18].show();
            this.items.items[19].show();
            this.items.items[20].show();
            this.items.items[21].show();
            this.items.items[22].show();
            this.items.items[23].show();
            this.items.items[24].hide();
        }
        else{
            this.items.items[18].hide();
            this.items.items[19].hide();
            this.items.items[20].hide();
            this.items.items[21].hide();
            this.items.items[22].hide();
            this.items.items[23].hide();
            this.items.items[24].show();
        }
    },
    
    changeButtonsStatus: function(pageNumber,totalRecords){
        var totalPages = Math.ceil(totalRecords/Helpdesk.Globals.pageSizeGrid);
        if(totalPages <= 0){
            totalPages = 1;
        }
        if(pageNumber == totalPages){
            this.items.items[15].disable();
            this.items.items[16].disable();
        }
        else{
            this.items.items[15].enable();
            this.items.items[16].enable();
        }
        
        if(pageNumber > 1){
            this.items.items[0].enable();
            this.items.items[1].enable();
        }
        else{
            this.items.items[0].disable();
            this.items.items[1].disable();
        }
    }    
});