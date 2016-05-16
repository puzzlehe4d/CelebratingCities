var db = require('../config/dbConfig');
db.plugin('registry')
var Hub = require('../db/hubModel');
var HubsUsers = require('../db/hubsUsersModel')
var User = db.Model.extend({
  tableName: 'users',
  hubs: function() {
    return this.belongsToMany(Hub).through(HubsUsers);
  }
});
 

module.exports = db.model('User', User);;
