var db = require('../config/dbConfig');
db.plugin('registry');
var User = require('../db/userModel');
var Hub = require('../db/hubModel');
var RidesUsers = require('../db/ridesUsersModel');


var Ride = db.Model.extend({
  tableName: 'rides',
  users: function() {
    return this.belongsToMany(User).through(RidesUsers);
  },

  hubs: function () {
  	return this.belongsTo(Hub)
  }
});

module.exports = db.model('Ride', Ride);;
