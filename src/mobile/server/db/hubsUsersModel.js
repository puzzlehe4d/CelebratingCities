 var db = require('../config/dbConfig');
 var HubsUsers = db.Model.extend({
     tableName: 'hubs_users'
 });

 module.exports = db.model('HubsUsers', HubsUsers);;