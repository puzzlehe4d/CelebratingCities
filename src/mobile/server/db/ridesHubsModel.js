 var db = require('../config/dbConfig');
 var RidesHubs = db.Model.extend({
     tableName: 'rides_hubs'
 });

 module.exports = db.model('RidesHubs', RidesHubs);;