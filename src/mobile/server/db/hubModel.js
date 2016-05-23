var db = require('../config/dbConfig');
db.plugin('registry');
var User = require('../db/userModel');
var Ride = require('../db/rideModel');
var HubsUsers = require('../db/hubsUsersModel');
var Hub = db.Model.extend({
  tableName: 'hubs',
  users: function() {
    return this.belongsToMany(User).through(HubsUsers);
  },

  rides: function () {
  	return this.hasMany(Ride);
  }
});
module.exports = db.model('Hub', Hub);;
