/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('Helpdesk.Globals',{
    singleton: true,
    
    idAdminGroup: 1,
    userLogged: (document.getElementById("userLogged")!==null?Ext.decode(document.getElementById("userLogged").value):''),
    
    //Views
    errorview:0,
    homeview: 1,
    ticketview:2,
    settingsview:3,
    perfilview:4,
    
    settings_users_view: 0,
    settings_category_view: 1,
    settings_client_view: 2,
    settings_priority_view: 3,
    settings_emailconfig_view: 4,
    settings_sendemail_view: 5,
    
    perfil_detalhes_view:0,
    perfil_senha_view:1,
    
    ticket_datagrid:0,
    ticket_new:1,
    ticket_details:2,
    
    ticket_details_view:0,
    ticket_details_edit:1,
    
    reportsview:5,
    reports_category_view: 0,
    reports_user_view: 1,
    reports_client_view: 2,
    reports_export_view: 3,
    
    pageSizeGrid: 30,
    
    // java text returns
    change_password_complete: 'change-password-complete',
    email_not_sent: 'email-not-sent',
    invalid_username: 'invalid-username',
    
    // configure dashboard charts
    category_ticket: 'categoria-ticket',
    user_ticket: 'user-ticket',
    status_ticket: 'status-ticket',
    agent_ticket: 'agent-ticket',
    user_ticket_open: 'user-ticket-open',
    no_responsible_open: 'no-responsible-open',
    open_ticket: 'open-ticket',
    
    admin: 'ADMIN'
});