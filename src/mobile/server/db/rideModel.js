var db = require('../config/dbConfig');
db.plugin('registry');
var User = require('../db/userModel');
var Hub = require('../db/hubModel');

var Ride = db.Model.extend({
  tableName: 'rides',
  users: function() {
    return this.hasMany(User);
  },
  owner: function() {
    return this.belongsTo(User);
  },
  hubs: function () {
  	return this.belongsTo(Hub);
  }
});

module.exports = db.model('Ride', Ride);;
