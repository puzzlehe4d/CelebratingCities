var db = require('../config/dbConfig');
db.plugin('registry');
var User = require('../db/userModel');
var Ride = require('../db/rideModel');
var HubsUsers = require('../db/hubsUsersModel');
var RidesHubs = require('../db/ridesHubsModel')
var Hub = db.Model.extend({
  tableName: 'hubs',
  users: function() {
    return this.belongsToMany(User).through(HubsUsers);
  },

  rides: function () {
  	return this.hasMany(Ride).through(RidsHubs);
  }
});
module.exports = db.model('Hub', Hub);;
