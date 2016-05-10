var db = require('../config/dbConfig');
db.plugin('registry');
var User = require('../db/userModel');
var Hub = db.Model.extend({
  tableName: 'hubs',
  users: function() {
    return this.belongsToMany('User', 'id');
  }
});
module.exports = db.model('Hub', Hub);;
