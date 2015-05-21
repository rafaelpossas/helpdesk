/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.controller.Priority', {
    extend: 'Ext.app.Controller',
    stores: ['Priorities'],
    views: ['priority.Priority'],
    init: function() {
        this.control({
            'priority button#addPriority': {
                click: this.onButtonClickAdd
            },
            'priority button#deletePriority': {
                click: this.onButtonClickDelete
            },
            'priority button#savePriority': {
                click: this.onButtonClickSave
            }
        });
    },
    refs: [
        {
            ref: 'priorityGrid',
            selector: 'priority > prioritygrid'
        }
    ],
    /**
     * Adiciona uma nova Prioridade ao grid
     * 
     * @param {type} button
     * @param {type} e
     * @param {type} options
     * @returns {undefined}
     */
    onButtonClickAdd: function(button, e, options){
        var rec = new Helpdesk.model.Priority();
        var grid = this.getPriorityGrid();
        grid.getStore().insert(0, rec);
        grid.editingPlugin.startEdit(rec,1);
    },
    /**
     * Remove Prioridade selecionada, verificando se algum registro foi alterado.
     * 
     * @param {type} button
     * @param {type} e
     * @param {type} options
     * @returns {undefined}
     */
    onButtonClickDelete: function(button, e, options) {
        var grid = this.getPriorityGrid();
        var record = grid.getSelectionModel().getSelection();
        var store = grid.getStore();
        if (store.getModifiedRecords().length > 0) {
            Helpdesk.util.Dialogs.lostChangesDialog(function(buttonId) {                
                if (buttonId === 'yes') {                    
                    Helpdesk.util.Dialogs.deleteDialog(function(buttonId) {
                        if (buttonId === 'yes') {
                            store.load({callback:function(){
                                    store.remove(record);
                                    store.sync();   
                                }
                            });                            
                        }
                    });
                }
            });
        }
        else{
            Helpdesk.util.Dialogs.deleteDialog(function(buttonId) {
                if (buttonId === 'yes') {
                    store.remove(record);
                    store.sync();
                }
            });
        }
    },
    /**
     * Salva as informações modificadas na Store
     * 
     * @param {type} button
     * @param {type} e
     * @param {type} options
     * @returns {undefined}
     */
    onButtonClickSave: function(button, e, options){
        this.getPriorityGrid().getStore().sync({
            callback:function(){
                Ext.Msg.alert(translations.INFORMATION,translations.PRIORITY+' '+ translations.SAVED_WITH_SUCCESS+'!');
            }
        });
    }
});

