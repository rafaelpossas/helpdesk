Ext.define('Helpdesk.controller.TicketAnswer', {
    requires: ['Helpdesk.store.TicketAnswers'],
    extend: 'Ext.app.Controller',
    stores: ['TicketAnswers'],
    controllers: ['Ticket'],
    views: [
        'ticket.TicketDetails'
    ],
    init: function() {
        this.control({
            'button#btnSaveAnswTkt': {
                click: this.saveNewAnswer
            }
        });
    },
    refs: [
        {
            ref: 'panelTktAnswers',
            selector: 'ticketdetails > form > #tktAnswers'
        },
        {
            ref: 'ticketDetails',
            selector: 'ticketdetails'
        }
    ],
    saveNewAnswer: function(button, e, options) {
        var panel = button.up('container');
        var form = panel.up('form');
        var tktDetails = form.up();
        var multiupload = tktDetails.down('form').down('multiupload');
        this.submitValues(button, multiupload);
    },
    submitValues: function(button, multiupload) {
        var scope = this;

        var panel = button.up('container');
        var form = panel.up('form');
        var txtNewAnswer = form.down('textarea#tktNewAnswer');

        if (multiupload.filesListArchive.length > 0) {
            var time = new Date().getTime();
            var userLogadoText = Ext.DomHelper.append(Ext.getBody(), '<input type="text" name="username" value="' + Helpdesk.Globals.userLogged.userName + '">');
            //Criação do form para upload de arquivos
            var formId = 'fileupload-form-' + time;
            var formEl = Ext.DomHelper.append(Ext.getBody(), '<form id="' + formId + '" method="POST" action="attachments" enctype="multipart/form-data" class="x-hide-display"></form>');
            formEl.appendChild(userLogadoText);
            Ext.each(multiupload.filesListArchive, function(fileField) {
                formEl.appendChild(fileField);
            });

            var form = $("#" + formId);
            form.ajaxForm({
                beforeSend: function() {

                },
                uploadProgress: function(event, position, total, percentComplete) {
                    txtNewAnswer.setLoading(translations.UPLOADING_FILES + percentComplete + '%');
                },
                success: function() {

                },
                complete: function(xhr) {
                    var responseJSON = Ext.decode(xhr.responseText);
                    if (responseJSON.success) {
                        txtNewAnswer.setLoading(false);
                        scope.saveAnswer(button);
                    }
                    else {
                        txtNewAnswer.setLoading(false);
                    }
                }
            });
            form.submit();

            //Clear Fields
            multiupload.filesListArchive.length = 0;
            multiupload.fileslist.length = 0;
            multiupload.doLayout();
        }
        else {
            scope.saveAnswer(button);
        }

    },
    /**
     * Salva uma nova resposta para o ticket
     * 
     * @author André Sulivam
     * @param {type} button
     * @param {type} e
     * @param {type} options
     * @returns {undefined}
     */
    saveAnswer: function(button, e, options) {
        var scope = this;
        var panel = button.up('container');
        var form = panel.up('form');
        var tktDetails = form.up();
        var tela = tktDetails.up().up().up().up();
        var panelTktAnswers = tktDetails.down('form').down('#tktAnswers');
        var txtNewAnswer = form.down('textarea#tktNewAnswer');
        if (txtNewAnswer.getValue() !== "") {
            tela.setLoading(translations.SAVING_REPLY);
            var store = this.getTicketAnswersStore();
            var record = form.getRecord();
            var answer = new Helpdesk.model.TicketAnswer;
            answer.data.ticketId = record.data.id;
            answer.data.userId = Helpdesk.Globals.userLogged.id;
            answer.data.description = form.down('textarea#tktNewAnswer').getValue();
            store.add(answer);
            store.proxy.url = 'ticket-answer';
            store.sync({
                callback: function(result) {
                    store.proxy.url = 'ticket-answer';
                    tela.setLoading(false);
                    
                    // limpando valores preenchidos anteriormente
                    txtNewAnswer.setValue("");
                    var ticketView = panelTktAnswers.up().up();
                    var panelanswer = ticketView.down('panel #panelElementsNewAnswer');
                    scope.getTicketController().resetMultiupload(null, panelanswer);
                    
                    // atualizando a view com as informacoes mais recentes do ticket.
                    Ext.Router.redirect("ticket/" + answer.data.ticketId + "/edit");
                }
            });
        } else {
            Ext.Msg.alert(translations.INFORMATION, translations.TICKET_ANSWER_EMPTY_WARNING);
        }
    }
});

