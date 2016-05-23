 var db = require('../config/dbConfig');
 var RidesUsers = db.Model.extend({
     tableName: 'rides_users'
 });

 module.exports = db.model('RidesUsers', RidesUsers);;